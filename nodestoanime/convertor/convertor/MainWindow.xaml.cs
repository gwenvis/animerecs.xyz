using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Windows;
using Microsoft.Win32;
using Newtonsoft.Json;
using MALAPI;
using System.Net;

namespace convertor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        //Select file
        private void button_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.Filter = "JSON Files (*.json)|*.json|All Files|*.*";


            if (dialog?.ShowDialog() == true)
            {
                textBox_filepath.Text = dialog.FileName;
            }
        }

        private int errorsOccured;

        //Convert file to JSON
        private void button_convert_Click(object sender, RoutedEventArgs e)
        {
            //Open file
            string filepath = textBox_filepath.Text;

            //Return if file does not exist
            if (!File.Exists(filepath))
                return;

            dynamic json;

            try
            {
                //Load JSON and check if it is a valid JSON
                json = JsonConvert.DeserializeObject(File.ReadAllText(filepath));
            }
            catch (Exception ex)
            {
                LogNewLine("[Error] Could not parse the JSON. Error message: " + ex.Message);
                return;
            }

            if (json.nodes == null && json.edges == null)
            {
                LogNewLine("This json is not valid. Aborting conversion.");
                return;
            }

            Task.Factory.StartNew(() => MakeJSON(json));
        }

        private async Task MakeJSON(dynamic json)
        {
            errorsOccured = 0;
            if (await Convert(json))
                LogNewLine("Succeeded! The exported folder can be used.");
            else
                LogNewLine("Problems occured! Please check the log for more information.");
        }

        private async Task<bool> Convert(dynamic json)
        {
            //Create the node dictionary and instantiate the MAL Api.
            var nodeDict = new Dictionary<uint, Node>();
            MyAnimeListAPI mal = new MyAnimeListAPI();

            //Add each node to the directory, the nodes will later be connected.
            foreach (var node in json.nodes._data)
            {
                var a = node.First;

                if (a.isAnimeObject == true)
                {
                    Anime anime = null;

                    try
                    {
                        await Retry.Do(async () =>
                        {
                            anime = await mal.GetAnimeMalLink(a.malLink.ToString());
                        }, TimeSpan.FromSeconds(1));
                    }
                    catch (Exception ex)
                    {
                        LogNewLine("[Error] Could not get anime object after retrying 3 times. Skipping anime. Message: " + ex.Message);
                        errorsOccured++;
                        continue;
                    }

                    //Already make a webclient for downloading the image
                    using (WebClient web = new WebClient())
                    {
                        //Make sure the directories exists, if not create it.
                        Directory.CreateDirectory("./exported/img");

                        //Download the image
                        try
                        {
                            await Retry.Do(async () =>
                            {
                                await web.DownloadFileTaskAsync(new Uri(anime.PosterLink), $"./exported/img/{a.id.ToString()}.jpg");
                                LogNewLine($"Downloaded image to file location: " + $"./exported/img/{a.id.ToString()}.jpg");
                            }, TimeSpan.FromSeconds(1));
                        }
                        catch (Exception ex)
                        {
                            LogNewLine($"[Error] Failed downloading image, image will be unavailable. ({a.idToString()}) Message: {ex.Message}");
                            errorsOccured++;
                        }

                        ///Should the anime files be exported to a seperate file so it doesn't the json doesn't get big?
                        ///It might be loading useless files. I might do that later, first hope this actually works.
                        
                        AnimeNode tempAnim = new AnimeNode(anime.Title, anime.Synopsis, "./img/" + a.id.ToString() + ".jpg", anime.Genres, anime.Studios, anime.Score);
                        nodeDict.Add(uint.Parse(a.id.ToString()), tempAnim);
                        tempAnim = null; 
                        LogNewLine($"Added anime to node list. ({anime.Title})");
                    }
                }
                else
                {
                    nodeDict.Add(uint.Parse(a.id.ToString()), new NodePath(a.label.ToString()));
                    LogNewLine($"Added path to node list. ({a.label.ToString()})");
                }
            }

            //Now connect all the nodes.
            return ConnectNodes(json, nodeDict);
            
        }

        private bool ConnectNodes(dynamic json, Dictionary<uint, Node> nodeDict)
        {
            foreach (var edgeObj in json.edges._data)
            {
                var edge = edgeObj.First;

                //Add where this node leads to.
                Node temp;
                if (nodeDict.TryGetValue(uint.Parse(edge.from.ToString()), out temp))
                {
                    temp.AddDirectionTo(uint.Parse(edge.to.ToString()));
                    LogNewLine($"Added node {edge.to.ToString()} to node {edge.from.ToString()}.");
                }

                //Set where the node comes from.
                if (nodeDict.TryGetValue(uint.Parse(edge.to.ToString()), out temp))
                {
                    temp.SetDirectionFrom(uint.Parse(edge.from.ToString()));
                    LogNewLine($"Set node {edge.to.ToString()}'s from node to {edge.from.ToString()}.");
                }

            }

            LogNewLine("Writing JSON to file...");

            /// Export the JSON.           
            //Serialize the nodeDict to a usable json.
            var serializedJson = JsonConvert.SerializeObject(nodeDict);

            var file = File.Create("./exported/anime.json");

            //Save the JSON.
            using (var sw = new StreamWriter(file))
            {
                sw.Write(serializedJson);
                LogNewLine($"Finished writing JSON to file! Filesize: {file.Length / (1024)} KB");
            }
            
            return true;
        }

        private void LogNewLine(string text)
        {
            Dispatcher.Invoke(new Action(() =>
            {
                textBox_log.AppendText(text + Environment.NewLine);
                textBox_log.ScrollToEnd();
            }));
        }
    }
}

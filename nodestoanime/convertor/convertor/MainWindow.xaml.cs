using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            if (await ParseFiles(json))
                LogNewLine("Succeeded! The exported folder can be used.");
            else
                LogNewLine("Problems occured! Please check the log for more information.");
        }

        private async Task<bool> ParseFiles(dynamic json)
        {
            var nodeList = new Dictionary<uint, object>();
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
                        anime = await mal.GetAnimeMalLink(a.malLink.ToString());
                    }
                    catch (Exception)
                    {
                        LogNewLine($"[Error] Could not get anime object. ({a.label.ToString()}) MAL is down or the link is incorrect. Retrying 3 times.");

                        //If failed, retry 3 times.
                        //Honestly, this just seems like too much of a hack. If anyone ever reads this code, can someone think of a better way? Thanks.
                        await Task.Delay(1000);

                        bool s = false;

                        for (int i = 0; i < 3; i++)
                        {
                            LogNewLine($"Try {i+1} of 3.");

                            try
                            {
                                anime = await mal.GetAnimeMalLink(a.malLink.ToString());
                                s = true;
                            }
                            catch (Exception) { }
                        }

                        if (!s)
                        {
                            LogNewLine("[Error] Failed to get Anime. Skipping.");
                            continue;
                        }

                    }

                    //Already make a webclient for downloading the image
                    using (WebClient web = new WebClient())
                    {
                        //Make sure the directories exists, if not create it.
                        Directory.CreateDirectory("./exported/img");

                        //Download the image
                        try
                        {
                            await web.DownloadFileTaskAsync(new Uri(anime.PosterLink), $"./exported/img/{a.id.ToString()}.jpg");
                            LogNewLine($"Downloaded image to file location: " + $"./exported/img/{a.id.ToString()}.jpg");
                        }
                        catch (Exception ex)
                        {
                            LogNewLine("[Error] Could not download image. Retrying 3 times. Message: " + ex.Message);
                            await Task.Delay(1000);
                            bool succeeded = false;

                            for (int i = 0; i < 3; i++)
                            {
                                try
                                {
                                    LogNewLine($"Download image. Retries left: {3 - i}.");
                                    await web.DownloadFileTaskAsync(new Uri(anime.PosterLink), $"./exported/img/{a.id.ToString()}.jpg");
                                    LogNewLine($"Downloaded image to file location: " + $"./exported/img/{a.id.ToString()}.jpg");
                                    succeeded = true;
                                    break;
                                }
                                catch (Exception) { await Task.Delay(1000); }
                            }

                            if (!succeeded)
                            {
                                LogNewLine("[Error] Failed downloading image, image will be unavailable.");
                            }
                        }

                        ///Should the anime files be exported to a seperate file so it doesn't the json doesn't get big?
                        ///It might be loading useless files. I might do that later, first hope this actually works.
                        
                        AnimeNode tempAnim = new AnimeNode(anime.Title, anime.Synopsis, "./img/" + a.id.ToString(), anime.Genres, anime.Studios, anime.Score);
                        nodeList.Add(uint.Parse(a.id.ToString()), tempAnim);
                        tempAnim = null; 
                        LogNewLine($"Added anime to node list. ({anime.Title})");
                    }
                }
                else
                {
                    nodeList.Add(uint.Parse(a.id.ToString()), new NodePath(a.label.ToString()));
                    LogNewLine($"Added path to node list. ({a.label.ToString()})");
                }
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

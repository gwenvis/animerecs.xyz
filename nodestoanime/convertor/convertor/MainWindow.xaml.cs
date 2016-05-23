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

            MakeJSON(json).Wait();
        }

        private async Task<bool> MakeJSON(dynamic json)
        {
            var nodeList = new Dictionary<uint, object>();
            MyAnimeListAPI mal = new MyAnimeListAPI();

            //Add each node to the directory, the nodes will later be connected.
            foreach (var node in json.nodes._data)
            {
                var a = node.First;

                if (a.isAnimeObject == true)
                {
                    Anime anime = await mal.GetAnimeMalLink(a.malLink.ToString());

                    //Already make a webclient for downloading the image
                    using (WebClient web = new WebClient())
                    {
                        //Make sure the directories exists, if not create it.
                        Directory.CreateDirectory("./exported/img");

                        //Download the image
                        try
                        {
                            await web.DownloadFileTaskAsync(new Uri(anime.PosterLink), $"./exported/img/{a.id.ToString()}");
                            LogNewLine($"Downloaded image to file location: " + $"./exported/img/{a.id.ToString()}");
                        }
                        catch (Exception ex)
                        {
                            LogNewLine("[Error] Could not download image. Aborting. Message: " + ex.Message);
                            return false;
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
                    LogNewLine("Added path to node list.");
                }
            }

            return true;
            
        }

        private void LogNewLine(string text)
        {
            textBox_log.Text += text + Environment.NewLine;
        }
    }
}

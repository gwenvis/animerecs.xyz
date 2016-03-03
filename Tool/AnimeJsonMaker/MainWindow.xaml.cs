using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.IO;
using Newtonsoft.Json;
using System.Net;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace AnimeJsonMaker
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        const string saveFilePath = @"./AnimeSaveFile.json";

        public MainWindow()
        {
            InitializeComponent();

            if (!File.Exists(saveFilePath))
                return;

            using (StreamReader sr = new StreamReader(saveFilePath))
            {
                List<Anime> blah = new List<Anime>();
                var root = JsonConvert.DeserializeObject<List<Anime>>(sr.ReadToEnd());
                foreach(var anime in root)
                {
                    animeList.Items.Add(anime);
                }
                sr.Close();
            }
            
        }

        private void SaveList(Anime anime)
        {
            anime.showName = tb_animename.Text;
            anime.malLink = tb_mallink.Text;
            anime.showSummary = tb_animesummary.Text;
            anime.imageLocation = tb_filelocation.Text;
            anime.genres = tb_genres.Text;
            anime.studio = tb_studio.Text;
            anime.imageLocation = tb_filelocation.Text;

            anime.categories = new List<string>();
            foreach(var cat in cats.Items)
            {
                var check = cat as CheckBox;
                if ((bool)check.IsChecked)
                    anime.categories.Add(check.Name);
            }

            var json = JsonConvert.SerializeObject(animeList.Items);
            using (StreamWriter sw = new StreamWriter(saveFilePath, false))
            {
                sw.Write(json);
                sw.Close();
            }
        }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        private async Task ExportList()

        {
            if (animeList.Items.Count < 1)
                return;

            string json = "{";

            foreach(var cat in cats.Items)
            {
                var check = cat as CheckBox;
                string name = check.Name.Replace("t_", "");
                //adds "name" : [
                json += $"\"{name}\":[";

                List<Anime> CategoryAnime = new List<Anime>();
                //Get all anime with current loop's category.
                foreach (var item in animeList.Items)
                {
                    var anime = item as Anime;
                    if (anime.categories.Any(e => e == check.Name))
                        CategoryAnime.Add(anime);
                }

                if (CategoryAnime.Count != 0)
                {
                    foreach (var item in CategoryAnime)
                    {
                        var anime = item as Anime;
                        bool AddComma = item == CategoryAnime[CategoryAnime.Count - 1] ? false : true;

                        json += $"{{ \"show\" : \"{anime.showName.Replace("\"", "\\\"")}\",";     //adds { "show":"showName",
                        json += $"\"summary\" : \"{anime.showSummary.Replace("\"", "\\\"")}\",";  //adds "summary" : "showSummary",
                        json += $"\"studio\" : \"{anime.studio.Replace("\"", "\\\"")}\",";        //adds "studio" : "animeStudio",
                        json += $"\"poster\" : \"{anime.imageLocation.Replace("\"", "\\\"")}\","; //adds "poster" : "imageLink",
                        json += $"\"mallink\" : \"{anime.malLink}\",";
                        json += $"\"genres\" : \"{anime.genres.Replace("\"", "\\\"")}\" }}";      //adds "genres" : "genres" }
                        

                        if (AddComma)
                            json += ',';
                    }
                }

                json += ']';
                
                bool AddaComma = cat == cats.Items[cats.Items.Count - 1] ? false : true;
                if (AddaComma)
                    json += ',';
            }

            json += "}";
            json = json.Replace(System.Environment.NewLine, "\\r\\n");
            StreamWriter sr = new StreamWriter("./anime.json", false);
            sr.Write(json);
            sr.Close();

        }
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously

        private void btn_animeadd_Click(object sender, RoutedEventArgs e)
        {
            if (tb_newshowname.Text.Length != 0)
            {
                //Don't add new show if the show is already added. (Name assumptions)
                if (animeList.Items.Count > 0)
                {
                    foreach (var item in animeList.Items)
                    {
                        var anime = item as Anime;

                        if (anime.showName == tb_newshowname.Text)
                            return;
                    }
                }
                var animeClass = new Anime(tb_newshowname.Text);
                animeList.Items.Add(animeClass);
            }
        }

        private void animeList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if(e.RemovedItems.Count > 0)
                SaveList(e.RemovedItems[0] as Anime);

            if (animeList.SelectedItem == null)
                return;

            var currentItem = animeList.SelectedItem as Anime;
            tb_animename.Text = currentItem.showName;
            tb_animesummary.Text = currentItem.showSummary;
            tb_filelocation.Text = currentItem.imageLocation;
            tb_genres.Text = currentItem.genres;
            tb_studio.Text = currentItem.studio;
            tb_mallink.Text = currentItem.malLink;
            tb_filelocation.Text = currentItem.imageLocation;

            foreach (var cat in cats.Items)
            {
                var check = cat as CheckBox;
                if (currentItem.categories.Any(x => x == check.Name))
                    check.IsChecked = true;
                else
                    check.IsChecked = false;
            }
        }

        private void btn_browse_Click(object sender, RoutedEventArgs e)
        {
            var fileDialog = new Microsoft.Win32.OpenFileDialog();
            fileDialog.Filter = "All Files|*.*";
            fileDialog.Multiselect = false;
            Nullable<bool> result = fileDialog.ShowDialog();

            if (result == true)
            {
                Directory.CreateDirectory("./img");
                string fileType = System.IO.Path.GetExtension(fileDialog.FileName);
                try
                {
                    File.Copy(fileDialog.FileName, $@"./img/{tb_animename.Text}{fileType}", true);
                }
                catch(Exception) { }
                
                tb_filelocation.Text = tb_animename.Text + fileType;
            }
        }

        private void btn_savejson_Click(object sender, RoutedEventArgs e)
        {
            SaveList(animeList.SelectedItem as Anime);
        }

        private void btn_export_Click(object sender, RoutedEventArgs e)
        {
            ExportList().Wait();
        }

        private void btn_AnimeRemove_Click(object sender, RoutedEventArgs e)
        {
            animeList.Items.Remove(animeList.SelectedItem);
        }
    }
}

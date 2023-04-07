using Microsoft.AspNetCore.Mvc;
using web_app.Model;
using Telegram.Bot.Types;
using Newtonsoft.Json.Linq;
using System.Net;
using web_app.EfCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/webhook")]
    public class WebHookController : ControllerBase
    {
        static HttpClient client = new HttpClient();
        private readonly DbHelper _db;

        public WebHookController(EF_DataContext eF_DataContext)
        {
            _db = new DbHelper(eF_DataContext);
        }

        [HttpPost]
        public async Task Post(Update update) 
        {
            try
            {
                // Add message in datebase
                MessageInfoModel messageInfoModel = new MessageInfoModel();

                string? FileId;
                string? FilePath;
                string? FilePathMessage;
                string? pathGetMessagePhoto;
                string? pathGetAvatar;

                byte[]? userAvatar = null;
                byte[]? textPhoto = null;

                string botId = Request.Headers["X-Telegram-Bot-Api-Secret-Token"].ToString().Replace("-", ":");

                // Get user photo id
                string pathGetPhotoId = "https://api.telegram.org/bot" + botId + "/getUserProfilePhotos?user_id="
                                        + update?.Message?.From?.Id.ToString();

                using HttpResponseMessage responseId = await client.GetAsync(pathGetPhotoId);
                string? dataId = await responseId.Content.ReadAsStringAsync();
                JObject resultId = JObject.Parse(dataId);


                if (resultId["result"]?["total_count"]?.ToString() != "0")
                {
                    FileId = resultId["result"]?["photos"]?[0]?[2]?["file_id"]?.ToString();

                    string? pathGetFile = "https://api.telegram.org/bot" + botId + "/getFile?file_id=" + FileId;
                    using HttpResponseMessage responseFile = await client.GetAsync(pathGetFile);
                    string? dataFile = await responseFile.Content.ReadAsStringAsync();
                    JObject resultFile = JObject.Parse(dataFile);

                    FilePath = resultFile["result"]?["file_path"]?.ToString();

                    pathGetAvatar = "https://api.telegram.org/file/bot" + botId + "/" + FilePath;

                    using (WebClient client = new WebClient())
                    {
                        userAvatar = client.DownloadData(pathGetAvatar);
                    }
                }
                else
                {
                    pathGetAvatar = null;
                }


                // Get filephoto chat
                if (update?.Message?.Photo?.ToString() != null)
                {
                    string? pathGetFileMessage = "https://api.telegram.org/bot" + botId + "/getFile?file_id=" + update?.Message?.Photo[2]?.FileId?.ToString();
                    using HttpResponseMessage responseFileMessage = await client.GetAsync(pathGetFileMessage);
                    string? dataFileMessage = await responseFileMessage.Content.ReadAsStringAsync();
                    JObject? resultFileMessage = JObject.Parse(dataFileMessage);

                    FilePathMessage = resultFileMessage["result"]?["file_path"]?.ToString();
                    //Get photo message
                    pathGetMessagePhoto = "https://api.telegram.org/file/bot" + botId + "/" + FilePathMessage;

                    using (WebClient client = new WebClient())
                    {
                        textPhoto = client.DownloadData(pathGetMessagePhoto);
                    }
                }
                else
                {
                    pathGetMessagePhoto = null;
                }

                // Set info model
                if (update?.Message != null)
                {
                    messageInfoModel.BotId = botId;
                    messageInfoModel.ChatId = update.Message.Chat.Id.ToString();
                    messageInfoModel.MessageId = update.Message.MessageId.ToString();
                    messageInfoModel.Type = update.Message.Chat.Type.ToString();
                    messageInfoModel.Username = update.Message.From?.Username?.ToString();
                    messageInfoModel.UserAvatar = userAvatar;
                    messageInfoModel.nameFrom = update.Message.Chat.Title?.ToString();
                    messageInfoModel.Date = update.Message.Date.ToString();
                    messageInfoModel.Text = update.Message.Text?.ToString();
                    messageInfoModel.TextPhoto = textPhoto;
                }
                else
                {
                    if (update?.MyChatMember != null)
                    {

                    }
                    else
                    {
                        messageInfoModel.BotId = botId;
                        messageInfoModel.ChatId = update?.ChannelPost?.SenderChat?.Id.ToString();
                        messageInfoModel.MessageId = update?.ChannelPost?.MessageId.ToString();
                        messageInfoModel.Type = update?.ChannelPost?.SenderChat?.Type.ToString();
                        messageInfoModel.Username = update?.ChannelPost?.SenderChat?.Title?.ToString();
                        messageInfoModel.UserId = update?.Message?.From?.ToString();
                        messageInfoModel.nameFrom = update?.ChannelPost?.SenderChat?.Title?.ToString();
                        messageInfoModel.Date = update?.ChannelPost?.Date.ToString();
                        messageInfoModel.Text = update?.ChannelPost?.Text?.ToString();
                    }
                }
                _db.AddMessage(messageInfoModel);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        [HttpGet]
        public ActionResult Get()
        {
            ResponseType type = ResponseType.Success;

            return Ok(ResponseHandler.GetAppResponse(type, "success"));
        }
    }
}

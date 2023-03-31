using Microsoft.AspNetCore.Mvc;
using web_app.Model;
using web_app.EfCore;
using Newtonsoft.Json.Linq;
using System.Net;

namespace OpenTelegramAPI.Contollers
{
    public class RequestMessageData
    {
        public string? Message { get; set; }
    }

    public class ResponseMessageData
    {
        public string? Status { get; set; }
        public string? Message { get; set; }
    }

    [ApiController]
    [Route("api/telegram")]
    public class TelegramController : ControllerBase
    {
        static HttpClient client = new HttpClient();
        private readonly DbHelper _db;

        public TelegramController(EF_DataContext eF_DataContext)
        {
            _db = new DbHelper(eF_DataContext);
        }

        [Route("getMessage/{botId}")]
        [HttpGet("{botId}")]
        public async Task<IActionResult> Get(string botId)
        {
            try
            {
                // Get message from telegram
                string data;
                string path = "https://api.telegram.org/bot" + botId + "/getUpdates";
                using HttpResponseMessage response = await client.GetAsync(path);
                data = await response.Content.ReadAsStringAsync();
                JObject result = JObject.Parse(data);

                // Add message in datebase
                for(int i = 0; i < result["result"]?.LongCount(); i++)
                {
                    MessageInfoModel messageInfoModel = new MessageInfoModel();

                    string FileId;
                    string FilePath;
                    string FilePathMessage;
                    string pathGetMessagePhoto;
                    string pathGetAvatar;

                    byte[] userAvatar = null;
                    byte[] textPhoto = null;


                    // Get user photo id
                    string pathGetPhotoId = "https://api.telegram.org/bot" + botId + "/getUserProfilePhotos?user_id=" 
                                            + result["result"]?[i]?["message"]?["from"]?["id"]?.ToString();

                    using HttpResponseMessage responseId = await client.GetAsync(pathGetPhotoId);
                    string dataId = await responseId.Content.ReadAsStringAsync();
                    JObject resultId = JObject.Parse(dataId);


                    if(resultId["result"]?["total_count"]?.ToString() != "0"){
                        FileId = resultId["result"]?["photos"]?[0]?[2]?["file_id"]?.ToString();

                        string pathGetFile = "https://api.telegram.org/bot" + botId + "/getFile?file_id=" + FileId;
                        using HttpResponseMessage responseFile = await client.GetAsync(pathGetFile);
                        string dataFile = await responseFile.Content.ReadAsStringAsync();
                        JObject resultFile = JObject.Parse(dataFile);

                        FilePath = resultFile["result"]?["file_path"]?.ToString();

                        pathGetAvatar = "https://api.telegram.org/file/bot" + botId + "/" + FilePath;

                        using (WebClient client = new WebClient())
                        {
                            userAvatar = client.DownloadData(pathGetAvatar);
                        }
                    }
                    else{
                        pathGetAvatar = null;
                    }
    

                    // Get filephoto chat
                    if (result["result"]?[i]?["message"]?["photo"]?.ToString() != null)
                    {
                        string pathGetFileMessage = "https://api.telegram.org/bot" + botId + "/getFile?file_id=" + result["result"]?[i]?["message"]?["photo"]?[1]?["file_id"]?.ToString();
                        using HttpResponseMessage responseFileMessage = await client.GetAsync(pathGetFileMessage);
                        string dataFileMessage = await responseFileMessage.Content.ReadAsStringAsync();
                        JObject resultFileMessage = JObject.Parse(dataFileMessage);

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
                    if (result["result"]?[i]?["message"] != null)
                    {
                        messageInfoModel.BotId = botId;
                        messageInfoModel.ChatId = result["result"]?[i]?["message"]?["chat"]?["id"]?.ToString();
                        messageInfoModel.MessageId = result["result"]?[i]?["message"]?["message_id"]?.ToString();
                        messageInfoModel.Type = result["result"]?[i]?["message"]?["chat"]?["type"]?.ToString();
                        messageInfoModel.Username = result["result"]?[i]?["message"]?["from"]?["username"]?.ToString();
                        messageInfoModel.UserId= result["result"]?[i]?["message"]?["from"]?["id"]?.ToString();
                        messageInfoModel.UserAvatar = userAvatar;
                        messageInfoModel.nameFrom = result["result"]?[i]?["message"]?["chat"]?["title"]?.ToString();
                        messageInfoModel.Date = result["result"]?[i]?["message"]?["date"]?.ToString();
                        messageInfoModel.Text = result["result"]?[i]?["message"]?["text"]?.ToString();
                        messageInfoModel.TextPhoto = textPhoto;
                    }
                    else
                    {
                        if (result["result"]?[i]?["my_chat_member"] != null)
                        {

                        }
                        else
                        {
                            messageInfoModel.BotId = botId;
                            messageInfoModel.ChatId = result["result"]?[i]?["channel_post"]?["sender_chat"]?["id"]?.ToString();
                            messageInfoModel.MessageId = result["result"]?[i]?["channel_post"]?["message_id"]?.ToString();
                            messageInfoModel.Type = result["result"]?[i]?["channel_post"]?["sender_chat"]?["type"]?.ToString();
                            messageInfoModel.Username = result["result"]?[i]?["channel_post"]?["sender_chat"]?["title"]?.ToString();
                            messageInfoModel.UserId = result["result"]?[i]?["message"]?["from"]?.ToString();
                            messageInfoModel.nameFrom = result["result"]?[i]?["channel_post"]?["sender_chat"]?["title"]?.ToString();
                            messageInfoModel.Date = result["result"]?[i]?["channel_post"]?["date"]?.ToString();
                            messageInfoModel.Text = result["result"]?[i]?["channel_post"]?["text"]?.ToString();
                        }
                    }
                    _db.AddMessage(messageInfoModel);
                }

                //get massage from database
                ResponseType type = ResponseType.Success;
                IEnumerable<MessageInfoModel> dataBases = _db.GetMessage(botId);

                if (!data.Any())
                {
                    type = ResponseType.NotFound;
                }

                return Ok(ResponseHandler.GetAppResponse(type, dataBases));
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }


        [Route("SendMessage")]
        [HttpPost]
        public async Task<IActionResult> SendMessage(SendMessage sendMessage)
        {
            try
            {
                string path = "https://api.telegram.org/bot" + sendMessage.BotId + "/sendMessage?chat_id=" + sendMessage.ChatId + "&text=" + sendMessage.Text + "&reply_to_message_id=" + sendMessage.MessageId;
                using HttpResponseMessage response = await client.GetAsync(path);
                MessageInfoModel messageInfoModel = new MessageInfoModel();
                messageInfoModel.MessageId = sendMessage.MessageId;
                _db.AddAnswer(messageInfoModel, sendMessage.Text);
                ResponseType type = ResponseType.Success;
                return Ok(ResponseHandler.GetAppResponse(type, sendMessage));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }


        [Route("DeleteMessage/{id}")]
        [HttpPost("{id}")]
        public IActionResult DeleteMessage(string id)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                _db.DeleteMessage(id);
                return Ok(ResponseHandler.GetAppResponse(type, id));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }
        
        [Route("AddComment")]
        [HttpPost]
        public IActionResult AddComment(Comment comment)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                MessageInfoModel messageInfoModel = new MessageInfoModel();
                messageInfoModel.MessageId = comment.MessageId;
                _db.AddComment(messageInfoModel, comment.Text);
                return Ok(ResponseHandler.GetAppResponse(type, comment.Text));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("GetUserPhoto/{botId}&{UserId}")]
        [HttpPost("{botId}&{UserId}")]
        public async Task<IActionResult> GetUserPhotoAsync(string botId,string UserId)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                string FileId;
                string FilePath;

                //Get user photo id
                string pathGetPhotoId = "https://api.telegram.org/bot" + botId + "/getUserProfilePhotos?user_id=" + UserId;
                using HttpResponseMessage responseId = await client.GetAsync(pathGetPhotoId);
                string dataId = await responseId.Content.ReadAsStringAsync();
                JObject resultId = JObject.Parse(dataId);

                FileId = resultId["result"]?["photos"]?[0]?[2]?["file_id"]?.ToString();

                //Get path file
                string pathGetFile = "https://api.telegram.org/bot" + botId + "/getFile?file_id=" + FileId;
                using HttpResponseMessage responseFile = await client.GetAsync(pathGetFile);
                string dataFile = await responseFile.Content.ReadAsStringAsync();
                JObject resultFile = JObject.Parse(dataFile);

                FilePath = resultFile["result"]?["file_path"]?.ToString();


                //Get Avatar
                string pathGetAvatar = "https://api.telegram.org/file/bot" + botId + "/" + FilePath;



                return Ok(ResponseHandler.GetAppResponse(type, pathGetAvatar));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }
    }
}

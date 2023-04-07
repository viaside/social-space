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
        public IActionResult GetMessage(string botId)
        {
            try
            {
                //get massage from database
                ResponseType type = ResponseType.Success;
                IEnumerable<MessageInfoModel> dataBases = _db.GetMessage(botId);

                return Ok(ResponseHandler.GetAppResponse(type, dataBases));
            }
            catch (Exception ex)
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

        [Route("CheckMessage/{MessageId}")]
        [HttpPost("{MessageId}")]
        public IActionResult CheckMessage(string MessageId)
        {
            ResponseType type = ResponseType.Success;
            try
            {

                _db.CheckMessage(MessageId);
                return Ok(ResponseHandler.GetAppResponse(type, MessageId));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }
    }
}

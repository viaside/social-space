﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using web_app.EfCore;
using web_app.Model;

namespace web_app.Controllers
{

    [ApiController]
    [Route("api/User")]
    public class UserApi : ControllerBase
    {
        private readonly DbHelper _db;
        static HttpClient client = new HttpClient();


        public UserApi(EF_DataContext eF_DataContext)
        {
            _db = new DbHelper(eF_DataContext);
        }

        [Route("Get")]
        [HttpGet]
        public ActionResult Get()
        {
            ResponseType type = ResponseType.Success;
            try
            {
                IEnumerable<UserInfoModel> data = _db.GetUsers();

                if (!data.Any())
                {
                    type = ResponseType.NotFound;
                }
                return Ok(ResponseHandler.GetAppResponse(type, data));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("GetInfo/{id}")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                UserInfoModel data = _db.GetUsersById(id);

                return Ok(ResponseHandler.GetAppResponse(type, data));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("Login")]
        [HttpPost]
        public IActionResult UserLogin(UserLogin userLogin)
        {
            HttpResponseMessage respMessage = new HttpResponseMessage();

            try
            {
                var CheckUserLogin = _db.LoginUser(userLogin);
                if (CheckUserLogin.Success == true)
                {
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = false,
                        SameSite = SameSiteMode.None,
                        Secure = true
                    };
                    ResponseType type = ResponseType.Success;
                    return Ok(ResponseHandler.GetAppResponse(type, CheckUserLogin.Id));
                }
                else
                {
                    throw new InvalidOperationException("Invalid User");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }


        [Route("Registr")]
        [HttpPost]
        public IActionResult Regists([FromBody] UserInfoModel model)
        {
            try
            {
                ResponseType responseType = ResponseType.Success;
                _db.SaveUser(model);
                return Ok(ResponseHandler.GetAppResponse(responseType, model));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("DeleteUser/{id}")]
        [HttpPost("{id}")]
        public IActionResult DeleteUser(int id)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                _db.DeleteUser(id);
                return Ok(ResponseHandler.GetAppResponse(type, id));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("LogOut")]
        [HttpPost]
        public IActionResult LogOut()
        {
            ResponseType type = ResponseType.Success;

            try
            {
                return Ok(ResponseHandler.GetAppResponse(type, Response.Cookies.GetHashCode()));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("ChangeLogin")]
        [HttpPut]
        public IActionResult ChangeLogin([FromBody] UserInfoModel model)
        {
            ResponseType type = ResponseType.Success;

            try
            {
                _db.ChangeLogin(model);
                return Ok(ResponseHandler.GetAppResponse(type, model.Login));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("ChangePassword")]
        [HttpPut]
        public IActionResult ChangePassword([FromBody] UserInfoModel model)
        {
            ResponseType type = ResponseType.Success;

            try
            {
                _db.ChangePassword(model);
                return Ok(ResponseHandler.GetAppResponse(type, model.Password));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        
        [Route("ChangeInfo")]
        [HttpPut]
        public IActionResult ChangeInfo([FromBody] UserInfoModel model)
        {
            ResponseType type = ResponseType.Success;

            try
            {
                _db.ChangeInfo(model);
                return Ok(ResponseHandler.GetAppResponse(type, "success"));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("AddBot/{UserId}&{BotId}")]
        [HttpPost("{UserId}&{BotId}")]
        public async Task<IActionResult> AddBot(int UserId, string BotId)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                string path = "https://api.telegram.org/bot" + BotId + "/getMe";

                using HttpResponseMessage responseId = await client.GetAsync(path);
                string dataId = await responseId.Content.ReadAsStringAsync();
                JObject resultId = JObject.Parse(dataId);

                if(resultId["ok"]?.ToString() == "True"){
                    string botName = resultId["result"]["first_name"].ToString();
                    UserInfoModel userInfoModel = new UserInfoModel();
                    userInfoModel.Id = UserId;
                    _db.AddBot(userInfoModel, BotId + "----" + botName);

                    // delete webhook in telegram bot api
                    string pathWHDelete = "https://api.telegram.org/bot" + BotId + "/deleteWebhook";
                    using HttpResponseMessage responseIdwhdelete = await client.GetAsync(pathWHDelete);


                    // add webhook in telegram bot api
                    string pathserv = "https://7bf0-178-173-104-255.ngrok-free.app/api/webhook/";
                    string pathWH = "https://api.telegram.org/bot" + BotId + "/setWebhook?url=" + pathserv + "&secret_token=" + BotId.Replace(":", "-");
                    using HttpResponseMessage responseIdwh = await client.GetAsync(pathWH);
                    string dataIdwh = await responseId.Content.ReadAsStringAsync();
                    JObject resultIdwh = JObject.Parse(dataIdwh);

                    return Ok(ResponseHandler.GetAppResponse(type, responseIdwh));
                }
                else
                {
                    throw new Exception(resultId["ok"]?.ToString());
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("DeleteBot/{UserId}&{BotId}")]
        [HttpPost("{UserId}&{BotId}")]
        public async Task<IActionResult> DeleteBot(int UserId, string BotId)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                UserInfoModel userInfoModel = new UserInfoModel();
                userInfoModel.Id = UserId;

                // delete webhook in telegram bot api
                string pathWH = "https://api.telegram.org/bot" + BotId.Split("----")[0] + "/deleteWebhook";
                await client.GetAsync(pathWH);

                Console.WriteLine(pathWH);

                _db.DeleteBot(userInfoModel, BotId);
                return Ok(ResponseHandler.GetAppResponse(type, BotId));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }


        [Route("AddSetting/{UserId}&{Setting}")]
        [HttpPost("{UserId}&{Setting}")]
        public IActionResult AddSetting(int UserId, string[] Setting)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                UserInfoModel userInfoModel = new UserInfoModel();
                userInfoModel.Id = UserId;
                _db.AddSetting(userInfoModel, Setting);
                return Ok(ResponseHandler.GetAppResponse(type, Setting));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("ConnectGroup/{UserId}&{name}")]
        [HttpPost("{UserId}&{name}")]
        public IActionResult ConnectGroup(int UserId, string Name)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                UserInfoModel userInfoModel = new UserInfoModel();
                userInfoModel.Id = UserId;

                _db.ConnectGroup(userInfoModel, Name, "new");
                return Ok(ResponseHandler.GetAppResponse(type, Name));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }


        [Route("AddGroup/{UserId}&{Name}")]
        [HttpPost("{UserId}&{Name}")]
        public IActionResult AddGroup(int UserId, string Name)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                GroupInfoModel groupInfoModel = new GroupInfoModel();
                groupInfoModel.Id = UserId;
                groupInfoModel.Name = Name;

                List<string> list = new List<string>();
                list.Add(UserId.ToString()+":"+"Admin:" );
                string[] str = list.ToArray();
                
                groupInfoModel.Members = str;
                _db.AddGroup(groupInfoModel);

                UserInfoModel userInfoModel = new UserInfoModel();
                userInfoModel.Id = UserId;
                _db.ConnectGroup(userInfoModel, Name, "Admin");
                return Ok(ResponseHandler.GetAppResponse(type, Name));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("AddMember/{GroupId}&{UserId}&{Role}")]
        [HttpPost("{GroupId}&{UserId}&{Role}")]
        public IActionResult AddMember(int GroupId, int UserId, string Role)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                GroupInfoModel groupInfoModel = new GroupInfoModel();
                groupInfoModel.Id = UserId;                
                _db.AddMember(groupInfoModel, UserId.ToString()+ "," + Role);
                return Ok(ResponseHandler.GetAppResponse(type, GroupId));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("GetGroup/{id}")]
        [HttpGet("{id}")]
        public IActionResult GetGroup(int id)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                GroupInfoModel data = _db.GetGroupById(id);

                return Ok(ResponseHandler.GetAppResponse(type, data));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("GetGroupMembersInfo/{id}")]
        [HttpGet("{id}")]
        public IActionResult GetGroupMembersInfo(int id)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                List<UserInfoModel> data = _db.GetGroupMemberInfoById(id);

                return Ok(ResponseHandler.GetAppResponse(type, data));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("KickMember/{GroupId}&{UserId}")]
        [HttpPost("{GroupId}&{UserId}")]
        public IActionResult KickMember(int GroupId, string UserId)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                _db.KickMember(GroupId, UserId);
                return Ok(ResponseHandler.GetAppResponse(type, GroupId));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }

        [Route("ChangeRole/{GroupId}&{UserId}&{Role}")]
        [HttpPost("{GroupId}&{UserId}&{Role}")]
        public IActionResult ChangeRole(int GroupId, string UserId, string Role)
        {
            ResponseType type = ResponseType.Success;
            try
            {
                _db.ChangeRole(GroupId, UserId, Role);
                return Ok(ResponseHandler.GetAppResponse(type, GroupId));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHandler.GetExceptionResponse(ex));
            }
        }
    }
}

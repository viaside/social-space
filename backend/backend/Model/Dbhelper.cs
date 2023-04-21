using System.Collections.Generic;
using System.Data;
using System.Linq;
using web_app.EfCore;

namespace web_app.Model
{
    public class DbHelper
    {
        private EF_DataContext _context;
        public DbHelper(EF_DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET
        /// </summary>
        /// <returns></returns>
        /// UserDB
        public List<UserInfoModel> GetUsers()
        {
            List<UserInfoModel> response = new List<UserInfoModel>();
            var dataList = _context.UserInfo.ToList();
            dataList.ForEach(row => response.Add(new UserInfoModel()
            {
                Id = row.Id,
                Login = row.Login,
                Password = row.Password,
            }));
            return response;
        }

        public UserInfoModel GetUsersById(int id)
        {
            UserInfoModel response = new UserInfoModel();
            var dataList = _context.UserInfo.Where(d => d.Id.Equals(id)).FirstOrDefault();
            return new UserInfoModel()
            {
                Id = dataList.Id,
                Login = dataList.Login,
                Password = dataList.Password,
                UsingBots = dataList.UsingBots,
                Settings = dataList.Settings,
                Group = dataList.Group,
                role = dataList.role
            };
        }

        /// <summary>
        /// It serves the POST/PUT/PATCH
        /// </summary>
        public void SaveUser(UserInfoModel userInfoModel)
        {
            UsersInfo dbTable = new UsersInfo();
            if (userInfoModel.Id > 0)
            {
                //PUT
                dbTable = _context.UserInfo.Where(d => d.Id.Equals(userInfoModel.Id)).FirstOrDefault();
                if (dbTable != null)
                {
                    dbTable.Login = userInfoModel.Login;
                    dbTable.Password = userInfoModel.Password;
                }
            }
            else
            {
                //POST
                dbTable.Login = userInfoModel.Login;
                dbTable.Password = userInfoModel.Password;
                _context.UserInfo.Add(dbTable);
            }
            _context.SaveChanges();
        }

        public void ChangeLogin(UserInfoModel usersInfoModel)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(usersInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                dbTable.Login = usersInfoModel.Login;
            }
            _context.SaveChanges();
        }

        public void ChangePassword(UserInfoModel usersInfoModel)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(usersInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                dbTable.Password = usersInfoModel.Password;
            }
            _context.SaveChanges();
        }
        

        public void ChangeInfo(UserInfoModel usersInfoModel)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(usersInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                dbTable.Login = usersInfoModel.Login;
                dbTable.Password = usersInfoModel.Password;
            }
            _context.SaveChanges();
        }

        public void DeleteUser(int id)
        {
            _context.UserInfo.Remove(_context.UserInfo.Single(a => a.Id == id));
            _context.SaveChanges();
        }

        public SignInResponse LoginUser(UserLogin userlogin)
        {
            var log = _context.UserInfo.Where(x => x.Login.Equals(userlogin.Login) &&
                      x.Password.Equals(userlogin.Password)).FirstOrDefault();

            if (log == null)
            {
                return new SignInResponse{ Success = false};
            }
            else
                return new SignInResponse{ Success = true, Id = log.Id, Login = log.Login};
        }

        public void AddBot(UserInfoModel userInfoModel, string botId)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(userInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                if (dbTable.UsingBots != null)
                {
                    string[] stringsDB = dbTable.UsingBots;
                    string[] strings = { botId };
                    string[] strings1 = strings!.Concat(stringsDB).ToArray();
                    dbTable.UsingBots = strings1;
                }
                else
                {
                    string[] strings = { botId };
                    dbTable.UsingBots = strings;
                }
            }
            _context.SaveChanges();
        }

        public void DeleteBot(UserInfoModel userInfoModel, string botId)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(userInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                string[] stringsDB = dbTable.UsingBots;
                /*var termsList = stringsDB == null ? new List<string>() : stringsDB.ToList();*/
                List<string> strings = new List<string> { };

                for (int i = 0; i < stringsDB.Length; i++)
                {
                    if(stringsDB[i] != botId)
                    {
                        strings.Add(stringsDB[i]);
                    }
                }
                dbTable.UsingBots = strings.ToArray();
            }
            _context.SaveChanges();
        }

        public void AddSetting(UserInfoModel userInfoModel, string[] setting)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(userInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                   dbTable.Settings = setting;
            }
            _context.SaveChanges();
        }
        public void ConnectGroup(UserInfoModel userInfoModel, string GroupName)
        {
            UsersInfo dbTable = new UsersInfo();
            dbTable = _context.UserInfo.Where(d => d.Id.Equals(userInfoModel.Id)).FirstOrDefault();
            
            GroupInfo group = new GroupInfo();
            group = _context.GroupInfo.Where(d => d.Name.Equals(GroupName)).FirstOrDefault();

            if (dbTable != null)
            {
                if (dbTable.Group != null)
                {
                    string[] stringsDB = dbTable.Group;
                    string[] strings = { (group.Id).ToString() + ":" +  group.Name };
                    string[] strings1 = strings!.Concat(stringsDB).ToArray();
                    dbTable.Group = strings1;
                }
                else
                {
                    string[] strings = { (group.Id).ToString() + ":" +  group.Name };
                    dbTable.Group = strings;
                }
            }
            _context.SaveChanges();
        }

        public void AddGroup(GroupInfoModel groupInfoModel)
        {
            GroupInfo dbTable = new GroupInfo();

            //POST
            dbTable.Name = groupInfoModel.Name;
            dbTable.Members = groupInfoModel.Members;
            _context.GroupInfo.Add(dbTable);
            _context.SaveChanges();
        }

        public void AddMember(GroupInfoModel groupInfoModel, string member)
        {
            GroupInfo dbTable = new GroupInfo();
            dbTable = _context.GroupInfo.Where(d => d.Id.Equals(groupInfoModel.Id)).FirstOrDefault();
            if (dbTable != null)
            {
                string[] stringsDB = dbTable.Members;
                string[] strings = {member};
                string[] strings1 = strings!.Concat(stringsDB).ToArray();
                dbTable.Members = strings1;
            }
            _context.SaveChanges();
        }

        // MessageDB
        public List<MessageInfoModel> GetMessage(string botId)
        {
            List<MessageInfoModel> response = new List<MessageInfoModel>();
            var dataList = _context.MessageInfo.Where(d => d.BotId.Equals(botId)).ToList();
            dataList.ForEach(row => response.Add(new MessageInfoModel()
            {
                Id = row.Id,
                BotId = row.BotId,
                ChatId = row.ChatId,
                MessageId = row.MessageId,
                Type = row.Type,
                Username = row.Username,
                UserId = row.UserId,
                UserAvatar = row.UserAvatar,
                nameFrom = row.nameFrom,
                Date = row.Date,
                Text = row.Text,
                TextPhoto = row.TextPhoto,
                Answers = row.Answers,
                Comments = row.Comments,
                isCheck = row.isCheck,
                Status = row.Status
            }));
            return response;
        }

        public void AddMessage(MessageInfoModel messageInfoModel)
        {
            MessageInfo dbTable = new MessageInfo();
            if (messageInfoModel.Id > 0)
            {
                //PUT
                dbTable = _context.MessageInfo.Where(d => d.Id.Equals(messageInfoModel.Id)).FirstOrDefault();
                if (dbTable != null)
                {
                    dbTable.BotId = messageInfoModel.BotId;
                    dbTable.ChatId = messageInfoModel.ChatId;
                    dbTable.MessageId = messageInfoModel.MessageId;
                    dbTable.Type = messageInfoModel.Type;
                    dbTable.Username = messageInfoModel.Username;
                    dbTable.UserId = messageInfoModel.UserId;
                    dbTable.UserAvatar = messageInfoModel.UserAvatar;
                    dbTable.nameFrom = messageInfoModel.nameFrom;
                    dbTable.Date = messageInfoModel.Date;
                    dbTable.Text = messageInfoModel.Text;
                    dbTable.TextPhoto = messageInfoModel.TextPhoto;
                    dbTable.Answers = null;
                    dbTable.Comments = null;
                    dbTable.isCheck = false;
                    dbTable.Status = 0;
                }
            }
            else
            {
                //POST
                dbTable.BotId = messageInfoModel.BotId;
                dbTable.ChatId = messageInfoModel.ChatId;
                dbTable.MessageId = messageInfoModel.MessageId;
                dbTable.Type = messageInfoModel.Type;
                dbTable.Username = messageInfoModel.Username;
                dbTable.UserId = messageInfoModel.UserId;
                dbTable.UserAvatar = messageInfoModel.UserAvatar;
                dbTable.nameFrom = messageInfoModel.nameFrom;
                dbTable.Date = messageInfoModel.Date;
                dbTable.Text = messageInfoModel.Text;
                dbTable.TextPhoto = messageInfoModel.TextPhoto;
                dbTable.Answers = null;
                dbTable.Comments = null;
                dbTable.isCheck = false;
                dbTable.Status = 0;
                _context.MessageInfo.Add(dbTable);
                _context.SaveChanges();
            }

        }

        public void DeleteMessage(string id)
        {
            _context.MessageInfo.Remove(_context.MessageInfo.Single(a => a.MessageId == id));
            _context.SaveChanges();
        }

        public void AddAnswer(MessageInfoModel messageInfoModel, string text)
        {
            MessageInfo dbTable = new MessageInfo();
            dbTable = _context.MessageInfo.Where(d => d.MessageId.Equals(messageInfoModel.MessageId)).FirstOrDefault();
            if(dbTable != null)
            {
                if(dbTable.Answers != null)
                {
                    string[] stringsDB = dbTable.Answers;
                    string[] strings = { text + "/" + DateTime.Now.ToString("h:m:ss dd/MM/yy") };
                    string[] strings1 = strings!.Concat(stringsDB).ToArray();
                    dbTable.Answers = strings1;
                }
                else
                {
                    string[] strings = { text + "/" + DateTime.Now.ToString("h:m:ss dd/MM/yy")};
                    dbTable.Answers = strings;
                }
            }
            _context.SaveChanges(); 
        }

        public void AddComment(MessageInfoModel messageInfoModel, string text)
        {
            MessageInfo dbTable = new MessageInfo();
            dbTable = _context.MessageInfo.Where(d => d.MessageId.Equals(messageInfoModel.MessageId)).FirstOrDefault();
            if (dbTable != null)
            {
                if (dbTable.Comments != null)
                {
                    string[] stringsDB = dbTable.Comments;
                    string[] strings = { text + "/" + DateTime.Now.ToString("h:m:ss dd/MM/yy") };
                    string[] strings1 = strings!.Concat(stringsDB).ToArray();
                    dbTable.Comments = strings1;
                }
                else
                {
                    string[] strings = { text + "/" + DateTime.Now.ToString("h:m:ss dd/MM/yy") };
                    dbTable.Comments = strings;
                }
            }
            _context.SaveChanges();
        }
        public void CheckMessage(string MessageId)
        {
            MessageInfo dbTable = new MessageInfo();
            dbTable = _context.MessageInfo.Where(d => d.MessageId.Equals(MessageId)).FirstOrDefault();
            if (dbTable != null)
            {
                dbTable.isCheck = true;
                if(dbTable.Status == null ||  dbTable.Status == 0){
                    dbTable.Status = 1;
                }
            }
            _context.SaveChanges();
        }

        public void ProcessMessage(string MessageId)
        {
            MessageInfo dbTable = new MessageInfo();
            dbTable = _context.MessageInfo.Where(d => d.MessageId.Equals(MessageId)).FirstOrDefault();
            if( dbTable != null){
                dbTable.Status = 2;
            }
            _context.SaveChanges();
        }
        
        public void EndMessage(string MessageId)
        {
            MessageInfo dbTable = new MessageInfo();
            dbTable = _context.MessageInfo.Where(d => d.MessageId.Equals(MessageId)).FirstOrDefault();
            if( dbTable != null){
                dbTable.Status = 3;
            }
            _context.SaveChanges();
        }
    }
}

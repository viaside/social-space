using System.Data.SqlTypes;

namespace web_app.Model
{
    public class UserInfoModel
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string[]? UsingBots { get; set; } 
        public string[]? Settings { get; set; }
        public string[]? Group { get; set; }
        public string[]? role  { get; set; }
    }

    public class GetInfoInResponse
    {
        public bool Success { get; set; }
    }
}

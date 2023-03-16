namespace web_app.Model
{
    public class UserLogin
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string[]? UsingBots { get; set; }
        public string[]? Settings { get; set; }
    }

    public class SignInResponse
    {
        public bool Success { get; set; }
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
    }
}

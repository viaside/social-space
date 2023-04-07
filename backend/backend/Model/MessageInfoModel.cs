namespace web_app.Model
{
    public class MessageInfoModel
    {
        public int Id { get; set; }
        public string? BotId { get; set; }
        public string? ChatId { get; set; }
        public string? MessageId { get; set; }
        public string? Type { get; set; }
        public string? Username { get; set; }
        public string? UserId { get; set; }
        public byte[]? UserAvatar { get; set; }
        public string? nameFrom { get; set; }
        public string? Date { get; set; }
        public string? Text { get; set; }
        public byte[]? TextPhoto { get; set; }
        public string[]? Answers { get; set; } 
        public string[]? Comments { get; set; } 
        public bool? isCheck{ get; set; }
    }
}

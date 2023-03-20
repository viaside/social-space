﻿namespace web_app.Model
{
    public class SendMessage
    {
        public string BotId { get; set; } = string.Empty;
        public string ChatId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }

    public class SendMessageResponse
    {
        public bool Success { get; set; }
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
    }
}

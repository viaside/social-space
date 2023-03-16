﻿using System.Data.SqlTypes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_app.EfCore
{
    [Table("MessageInfo")]
    public class MessageInfo
    {
        [Key,Required]
        public int Id { get; set; }
        public string? BotId { get; set; }
        public string? ChatId { get; set; }
        public string? MessageId { get; set; }
        public string? Type { get; set; }
        public string? Username { get; set; }
        public string? UserId { get; set; }
        public string? UserPhoto { get; set; }
        public string? nameFrom { get; set; }
        public string? Date { get; set; }
        public string? Text { get; set; }
        public string? TextPhotos { get; set; }
        public string[]? Answers { get; set; }
        public string[]? Comments { get; set; }
    }
}

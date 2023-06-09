﻿using System.Data.SqlTypes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_app.EfCore
{
    [Table("UsersInfo")]
    public class UsersInfo
    {
        [Key,Required]
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string[]? UsingBots { get; set; }
        public string[]? Settings { get; set; }
        public string[]? Group { get; set; }
    }
}

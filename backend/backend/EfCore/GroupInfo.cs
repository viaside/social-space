using System.Data.SqlTypes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_app.EfCore
{
    [Table("GroupInfo")]
    public class GroupInfo
    {
        [Key,Required]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string[]? Members { get; set; }
    }
}

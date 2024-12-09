 
namespace API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string BookName { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string PublishDate { get; set; } = null!;    
    }
}
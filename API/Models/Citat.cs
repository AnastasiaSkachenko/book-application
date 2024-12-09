namespace API.Models
{
    public class Citat
    {
        public int Id { get; set; }
        public string CitatText { get; set; } = null!;  // The quote text
        public string Author { get; set; } = null!;    // Author of the quote

        // Foreign key to the User who added the Citat
        public string UserId { get; set; }   = null!;
     }
}

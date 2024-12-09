using System.ComponentModel.DataAnnotations;


namespace API.Dtos
{
    public class CreateBookDto
    {
        [Required(ErrorMessage ="Book name is required.")]
        public string BookName { get; set; } = null!;


        [Required(ErrorMessage ="Author name is required.")]
        public string Author { get; set;} = null!;

        public string PublishDate { get; set;} = null!;


    }
}
using API.Dtos;
using API.Models;
using API.Data; // Ensure you have this namespace to access AppDbContext
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context; // Use AppDbContext here

        public BooksController(AppDbContext context) // Inject AppDbContext
        {
            _context = context;
        }

        // Create a new book
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDto createBookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = new Book
            {
                BookName = createBookDto.BookName,
                Author = createBookDto.Author,
                PublishDate = createBookDto.PublishDate
            };

            _context.Books.Add(book); // Directly add to Books
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book created successfully", book });
        }

        // Get all books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books.ToListAsync(); // Directly query Books
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBookById(int id)
        {
            // Fetch the book with the provided ID
            var book = await _context.Books.FindAsync(id);

            // Check if the book exists
            if (book == null)
            {
                return NotFound(); // Return a 404 if the book is not found
            }

            return Ok(book); // Return the book data
        }

        // Update an existing book
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] CreateBookDto updateBookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books.FindAsync(id); // Directly find the book

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            // Update the book properties
            book.BookName = updateBookDto.BookName;
            book.Author = updateBookDto.Author;
            book.PublishDate = updateBookDto.PublishDate;

            _context.Books.Update(book); // Directly update the book
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully", book });
        }

        // Delete a book by its ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id); // Directly find the book

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _context.Books.Remove(book); // Directly remove the book
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }
    }
}

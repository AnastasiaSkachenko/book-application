using API.Dtos;
using API.Models;
using API.Data; // Ensure you have this namespace to access AppDbContext
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CitatsController(AppDbContext context)
        {
            _context = context;
        }

        // Create a new citat (quote)
        [HttpPost]
        public async Task<IActionResult> CreateCitat([FromBody] CreateCitatDto createCitatDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Extract UserId from the JWT token
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
 
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            // Parse the userId safely
 

            // Create the Citat
            var citat = new Citat
            {
                CitatText = createCitatDto.CitatText,
                Author = createCitatDto.Author,
                UserId = userId  // Assign the UserId to the Citat
            };

            _context.Citats.Add(citat);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Citat created successfully", citat });
        }

        // Get a citat by its ID
        [HttpGet]
        public async Task<IActionResult> GetCitats()
        {
            // Extract UserId from the JWT token
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            // Parse the userId safely
// Extract UserId from the JWT token as a string
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        // Get all citats associated with the current user using the string UserId
        var citats = await _context.Citats
            .Where(c => c.UserId == userId)  // Use string comparison
            .ToListAsync();

        if (citats.Count == 0)
        {
            return NotFound(new { message = "No citats found for the current user" });
        }

        return Ok(citats);
        }
        // Update an existing citat
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCitat(int id, [FromBody] CreateCitatDto updateCitatDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var citat = await _context.Citats.FindAsync(id);

            if (citat == null)
            {
                return NotFound(new { message = "Citat not found" });
            }

            // Update citat properties
            citat.CitatText = updateCitatDto.CitatText;
            citat.Author = updateCitatDto.Author;

            _context.Citats.Update(citat);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Citat updated successfully", citat });
        }

        // Delete a citat by its ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCitat(int id)
        {
            var citat = await _context.Citats.FindAsync(id);

            if (citat == null)
            {
                return NotFound(new { message = "Citat not found" });
            }

            _context.Citats.Remove(citat);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Citat deleted successfully" });
        }
    }
}

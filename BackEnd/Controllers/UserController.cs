using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.IdentityModel.Tokens;
using EvenMT.Models;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Ajax.Utilities;
using System.Security.Cryptography;

namespace EvenMT.Controllers
{
    public class UserController : ApiController
    {
        private ModelDBContext db = new ModelDBContext();

        private const string SecretKey = "aRE;[1ku2ow3!.,erl]0aqsbd";

        // GET: api/User
        public IQueryable<User> GetUser()
        {
            return db.User;
        }

        // GET: api/User/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(long id)
        {
            User user = await db.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDTO
            {
                IdUser = user.IdUser,
                Name = user.Name,
                Surname = user.Surname,
                BirthPlace = user.BirthPlace,
                BirthDate = user.BirthDate,
                Avatar = user.Avatar,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Privacy = user.Privacy,
                Role = user.Role
            };

            return Ok(userDto);
        }

        // PUT: api/User/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(long id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.IdUser)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/User
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if(user.Avatar == null)
            {
                user.Avatar = "user.png";
            }
            else
            {
                try
                {
                    string avatarFileName = Guid.NewGuid().ToString();

                    string avatarData = user.Avatar;

                    byte[] avatarBytes = Convert.FromBase64String(avatarData);

                    // Percorsi completi per i file nelle cartelle "assets"
                    string basePhysicalPath = HttpContext.Current.Server.MapPath("~/Content/assets");
                    string avatarFilePath = Path.Combine(basePhysicalPath, avatarFileName);

                    File.WriteAllBytes(avatarFilePath, avatarBytes);

                    // Salva i percorsi delle immagini nel tuo modello
                    user.Avatar = avatarFileName;
                }

                catch (Exception ex)
                {
                    return BadRequest("Error while saving the file: " + ex.Message);
                }
            }

            db.User.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.IdUser }, user);
        }

        // DELETE: api/User/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(long id)
        {
            User user = await db.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.User.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(long id)
        {
            return db.User.Count(e => e.IdUser == id) > 0;
        }

        [Route("api/User/Login")]
        [HttpPost]
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> Login(User user)
        {

            // Verifica le credenziali dell'utente
            User u = await db.User.FirstOrDefaultAsync(x => x.Username == user.Username && x.Password == user.Password);

            if (u == null)
            {
                // L'utente non esiste o le credenziali non corrispondono
                return BadRequest("Credenziali non valide");
            }

            // Se l'utente esiste genera il token
            var token = GenerateToken(u.IdUser);


            // Puoi restituire l'utente o un token di accesso JWT qui
            return Ok(token);
        }

        private string GenerateToken(long userId)
        {
           try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var now = DateTime.UtcNow;

                // Configura il claim dell'identità dell'utente
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, userId.ToString())
            // Aggiungi altri claims se necessario
        };
                using (var rng = new RNGCryptoServiceProvider())
                {
                    var keyBytes = new byte[32];
                    rng.GetBytes(keyBytes);
                    var signingKey = new SymmetricSecurityKey(keyBytes);


                    // Configura le opzioni del token
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(claims),
                        Expires = now.Add(TimeSpan.FromHours(1)), // Scadenza del token
                        SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                    };
                    // Crea e firma il token JWT
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    // Serializza il token in una stringa
                    return tokenHandler.WriteToken(token);
                }

            } catch (Exception ex)
            {
                return $"Failed to login {ex.Message}";
            }
           
        }
    }
}
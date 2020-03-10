using Microsoft.AspNetCore.Authorization;
using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.Helpers
{
    public class AuthorizedAttribute : AuthorizeAttribute
    {
        public AuthorizedAttribute(params Role[] roles) : base()
        {
            var rolesNames = new List<string>();
            var names = Enum.GetNames(typeof(Role));
            foreach (var role in roles)
            {
                rolesNames.Add(names[(int)role]);
            }
            Roles = String.Join(",", rolesNames);
        }
    }
}

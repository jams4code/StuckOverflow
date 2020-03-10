using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.Helpers
{
    public static class CollectionMethodExtension
    {
        public static Boolean IsDifferentCollection<T>(ICollection<T> oldCollection, ICollection<T> newCollection)
        {
            if (oldCollection.Count() != newCollection.Count())
            {
                return true;
            }
            else
            {
                foreach (var item in oldCollection)
                {
                    if (!newCollection.Contains(item))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

    }
}

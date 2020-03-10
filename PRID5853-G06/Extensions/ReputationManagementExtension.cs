using PRID5853.G06.Entities.Models;
using PRID5853.G06.Persistence.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.Extensions
{
    public static class ReputationManagementExtension
    {

        public static void ReputationUpdate(User postOwner, User actor, ReputationAction action)
        {
            switch (action)
            {
                case ReputationAction.AcceptedAnswer:
                    actor.Reputation += 15;
                    postOwner.Reputation += 2;
                    break;
                case ReputationAction.PositiveVote:
                    postOwner.Reputation += 10;
                    break;
                case ReputationAction.NegativeVote:
                    postOwner.Reputation += (-2);
                    actor.Reputation += (-1);
                    break;
                default:
                    break;
            }
        }
    }

    public enum ReputationAction
    {
        AcceptedAnswer,
        PositiveVote,
        NegativeVote
    }
}

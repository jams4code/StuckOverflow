using PRID5853.G06.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PRID5853.G06.WebAPI.Helpers
{
    //Methode qui permet de de chercher la date de la dernière activité d'un POST
    public static class LastPostActivity
    {
        //On pourrait créer une action d'un controller qui enverrait cette donnée
        //Mais je préfère l'inclure dans le DTO
        //Il n'y pas de bonne ou mauvaise pratique dans ce cas.
        //Le DTO est sensé contenir les informations dont on a besoin pour la vue.
        //Selon moi c'est le plus approprié.
        public static DateTime GetLastPostActivity(Post post)
        {
            //Nous définirons une activité comme étant une réponse ou un commentaire supplémentaire (sur une question ou sur une réponse)
            //On pourrait aussi prendre en compte un PushUp ou un PushDown mais je ne trouve pas ça critique
            
            DateTime lastActivity = post.EditTimeStamp!=null?post.EditTimeStamp.Value:post.Timestamp;
            if (post.Replies != null && post.Replies.Count() > 0)
            {
                var lastReply = post.Replies.Max(r => r.Timestamp);
                if(lastReply > lastActivity)
                {
                    lastActivity = lastReply;
                }
                //Ensuite on check les commentaires des réponses
                //
                foreach (var reply in post.Replies)
                {
                    //Utilisation en réciproque puisque les reply sont des post
                    var lastReplyActivity = GetLastPostActivity(reply);
                    if (lastReplyActivity > lastActivity)
                    {
                        lastActivity = lastReplyActivity;
                    }
                }
                
            }
            //On check les commentaires
            if (post.Comments != null && post.Comments.Count() > 0)
            {
                var lastComment = post.Comments.Max(c => c.Timestamp);
                if (lastComment > lastActivity)
                {
                    lastActivity = lastComment;
                }
            }


            return lastActivity;
        }
    }
}

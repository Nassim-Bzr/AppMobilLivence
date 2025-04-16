import io from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:5000", { autoConnect: false });

export const useSocket = (token, activeConversation, setMessages, setConversations) => {
  // Connexion et authentification
  useEffect(() => {
    if (token) {
      socket.connect();
      socket.emit("authenticate", token);
      socket.on("authenticated", (data) => {
        console.log("Socket authentifié :", data);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Écoute de l'événement "new_message"
  useEffect(() => {
    socket.on("new_message", (message) => {
      console.log("Nouveau message reçu via socket :", message);

      // Si la conversation active correspond au message reçu, on met à jour la liste des messages
      if (activeConversation && (activeConversation.id === message.senderId || activeConversation.id === message.receiverId)) {
        setMessages(prev => [...prev, message]);
      }
      
      // Met à jour la liste des conversations : on peut modifier le dernier message et incrémenter le compteur de non-lus
      setConversations(prev =>
        prev.map(conv => {
          // Ici, on détermine la correspondance entre la conversation et le message (par exemple en comparant les IDs)
          if (conv.id === message.senderId || conv.id === message.receiverId) {
            return {
              ...conv,
              lastMessageAt: new Date(),
              lastMessageContent: message.contenu,
              unreadCount: (conv.unreadCount || 0) + 1
            };
          }
          return conv;
        })
      );
    });

    // Écoute des événements de typage (optionnel)
    socket.on("typing_start", (senderId) => {
      console.log(`L'utilisateur ${senderId} est en train d'écrire...`);
      // Ici, tu peux par exemple afficher une indication de "typing" dans ton UI
    });

    socket.on("typing_stop", (senderId) => {
      console.log(`L'utilisateur ${senderId} a arrêté d'écrire`);
      // Mets à jour ton UI pour cacher l'indication de typage
    });

    return () => {
      socket.off("new_message");
      socket.off("typing_start");
      socket.off("typing_stop");
    };
  }, [activeConversation, setMessages, setConversations]);
};

wlStore.updateStatus(user.id, "rejected");

user.send("❌ Sua WL foi rejeitada.").catch(() => {});

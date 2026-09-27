self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const client = clients.find((windowClient) => 'focus' in windowClient);
      return client ? client.focus() : self.clients.openWindow('/');
    })
  );
});
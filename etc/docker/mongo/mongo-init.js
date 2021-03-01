db.createUser({
  user: 'nextmongolocal',
  pwd: 'nextmongo2021',
  roles: [
    {
      role: 'readWrite',
      db: 'nextmongo'
    }
  ]
});
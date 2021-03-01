db.createUser({
  user: 'uolindieslocal',
  pwd: 'uolindies2020',
  roles: [
    {
      role: 'readWrite',
      db: 'uolindies'
    }
  ]
});
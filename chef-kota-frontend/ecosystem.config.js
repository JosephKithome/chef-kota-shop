module.exports = {
    apps: [
      {
        name: 'ChefKot-shop',
        script: 'node_modules/.bin/http-server', 
        args: 'dist/chefkotashop', 
        cwd: __dirname, 
        env: {
          PORT: 8080, 
        },
        interpreter: 'none',
      },
    ],
  };
  
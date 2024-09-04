FROM nginx:alpine

COPY dist/chefkotashop /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]

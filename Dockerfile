FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html 404.html CNAME robots.txt video.css video.js video.mp4 kirmy.css /usr/share/nginx/html/
COPY israel /usr/share/nginx/html/israel
COPY .well-known /usr/share/nginx/html/.well-known
EXPOSE 80

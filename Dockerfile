# use an existing docker image as a base
FROM node:16

# Download and install a dependency
WORKDIR /app
COPY ./package.json /app
RUN rm -rf ./dist
RUN cd /app && npm cache clean --force && rm -rf node_modules && npm install
COPY ./ /app
EXPOSE 4000

# Tell the image what to do when it starts
# As a container
CMD ["npm", "run", "start:dev"]

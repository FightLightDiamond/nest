# use an existing docker image as a base
FROM node:16

# Download and install a dependency
WORKDIR ./app
COPY ./package.json .
RUN npm install
COPY . .

# Tell the image what to do when it starts
# As a container
CMD ["npm", "run", "start:debug"]

EXPOSE 4000

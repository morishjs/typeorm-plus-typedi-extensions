import "reflect-metadata";
import {createConnection, useContainer} from "typeorm-plus";
import {Container} from "typedi";
import {PostRepository} from "./repository/PostRepository";
import {Post} from "./entity/Post";

useContainer(Container);
createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: [
        Post
    ],
    synchronize: true
}).then(async connection => {
    console.log("connected");

    const post1 = new Post();
    post1.title = "TypeScript 2.0";
    post1.text = `New TypeScript version adds control flow based type analysis features.`;

    const post2 = new Post();
    post2.title = "Control flow based type analysis";
    post2.text = `TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.`;

    const repository = Container.get(PostRepository);
    await Promise.all([
        repository.saveUsingRepository(post1),
        repository.saveUsingManager(post2)
    ]);

    console.log("Saved successfully.");

    const loadedPosts = await repository.findAll();
    console.log("All loaded posts: ", loadedPosts);

}).catch(error => console.log("Error: ", error));

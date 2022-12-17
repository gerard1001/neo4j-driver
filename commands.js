//change neo4j user password
/* ALTER USER neo4j SET  PASSWORD "new_password" */

//get all nodes
/* MATCH (n) RETURN n */

//create node
/* CREATE (n:READER {name: "Deo" , age: 28) RETURN n */

//update node
/* MATCH (n:READER {name: "Deo"})
   SET n.age=22 */
/* MATCH (n:READER)
   WHERE ID(n) = 1
   SET n.age = 22
   RETURN n.age */

//create relation between nodes (you can use multiple match commands)
/* MATCH (n:READER {name: "Deo"), (p:BOOK)
   CREATE (n) - [rel:HAS_READ {time: "16:25"}] -> (p)
   RETURN n, p */

//delete relations
/* MATCH (n:BOOK {title:"Skyfall"}) -[rel:RETURNED]-> (:READER) DELETE rel */

//delete a node
/* MATCH (n:READER {name:"Deo"})
   DETACH DELETE n */
/* MATCH (n:READER)
   WHERE ID(n) = 1
   DETACH DELETE n */

import pg from "pg";

class Database {
  constructor() {
    this.isConnected = false;
    // Setup configuration using environment variables
    this.config = {
      user: "avnadmin",
      password: process.env.password,
      host: "pg-marcelo-marcelo.d.aivencloud.com",
      port: 24646,
      database: "todo",
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.ca,
      },
    };
    // Create a new pg Client instance
    this.client = new pg.Client(this.config);

    this.client.makeConnetion = () => {
      this.client.connect((err) => {
        if (err) {
          console.error("Connection error", err.stack);
        } else {
          this.isConnected = true;
          console.log("Connected to the database");
        }
      });
    };
    // Connect to the database

    this.client.connectIfNeeded = () => {
      if (!this.isConnected) {
        this.client.makeConnetion();
      }
    };

    this.client.on("end", (err) => {
      this.isConnected = false;
      console.lgo("connection closed");
    });
  }

  /**
   * Verifies if a user exists in the database by user_id
   * @param {string} user_id - The ID of the user to verify
   * @returns {Promise<boolean>} True if the user exists, false otherwise
   */
  async verifyUserExists(user_id) {
    this.client.connectIfNeeded();
    try {
      const result = await this.client.query(
        "SELECT * FROM users WHERE id = $1",
        [user_id]
      );
      return result.rowCount === 1;
    } catch (err) {
      console.error("Error verifying user existence", err);
      return false;
    }
  }

  /**
   * Registers a new user in the database
   * @param {string} user_id - The ID of the user to register
   * @param {string} email - The email of the user to register
   * @returns {Promise<boolean>} True if the user was registered successfully, false otherwise
   */
  async registerUser(user_id, email, name) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "INSERT INTO users (id, email, name) VALUES ($1, $2, $3) RETURNING id",
        [user_id, email, name]
      );
      return result.rowCount === 1;
    } catch (err) {
      console.error("Error registering user", err);
      return false;
    }
  }

  /**
   *
   */
  async listAllTODOS(user_id) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "SELECT * FROM todos WHERE user_id = $1 AND deleted=false ORDER BY id ASC",
        [user_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Error listing todos", err);
      return false;
    }
  }

  /**
   *
   */
  async updateTODO(todo_id, content, done, deleted) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "UPDATE todos SET (content, done, deleted) VALUES ('$1', '$2', '$3') WHERE id = '$4'",
        [content, done, deleted, todo_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Error updating todo", err);
      return false;
    }
  }

  /**
   *
   */
  async updateTODODone(todo_id, done) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "UPDATE todos SET done=$1 WHERE id = $2",
        [done, todo_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Error updating todo", err);
      return false;
    }
  }

  /**
   *
   */
  async updateTODOContent(todo_id, content) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "UPDATE todos SET content=$1 WHERE id = $2",
        [content, todo_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Error updating todo", err);
      return false;
    }
  }

  /**
   *
   */
  async updateTODODelete(todo_id, deleted) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query(
        "UPDATE todos SET deleted=$1 WHERE id = $2",
        [deleted, todo_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Error updating todo", err);
      return false;
    }
  }

  /**
   *
   */
  async addTODO(user_id, content) {
    this.client.connectIfNeeded();
    if (content.length < 1) return false;
    try {
      const result = await this.client.query(
        "INSERT INTO todos (user_id, content) VALUES ($1, $2)",
        [user_id, content]
      );
      return result.rows;
    } catch (err) {
      console.error("Error inserting todo", err);
      return false;
    }
  }

  /**
   *
   */
  async deleteTODO(todo_id) {
    this.client.connectIfNeeded();

    try {
      const result = await this.client.query("DELETE FROM todos WHERE id=$1", [
        todo_id,
      ]);
      return result.rows;
    } catch (err) {
      console.error("Error inserting todo", err);
      return false;
    }
  }

  /**
   * Close the database connection
   */
  closeConnection() {
    this.client.end((err) => {
      if (err) {
        console.error("Error closing connection", err);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}

// Export an instance of the Database class
const db = new Database();

export default db;

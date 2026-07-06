/**
 * Database Schema Initialization - PostgreSQL
 * CEO and Creator: David Adriano Ferrari dos Santos
 * Davidhub - Real GitHub Clone
 */

const pool = require('./database');

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Initializing Davidhub database...');

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        bio TEXT,
        avatar VARCHAR(500),
        location VARCHAR(255),
        website VARCHAR(255),
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Repositories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS repositories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_private BOOLEAN DEFAULT false,
        stars INTEGER DEFAULT 0,
        forks INTEGER DEFAULT 0,
        watchers INTEGER DEFAULT 0,
        language VARCHAR(100),
        homepage VARCHAR(500),
        topics VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(owner_id, name)
      )
    `);

    // Branches Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        commit_sha VARCHAR(255),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(repo_id, name)
      )
    `);

    // Commits Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS commits (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id),
        branch_name VARCHAR(255),
        commit_sha VARCHAR(255) UNIQUE,
        message TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (repo_id, branch_name) REFERENCES branches(repo_id, name)
      )
    `);

    // Issues Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        author_id INTEGER NOT NULL REFERENCES users(id),
        assignee_id INTEGER REFERENCES users(id),
        state VARCHAR(50) DEFAULT 'open',
        labels VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Pull Requests Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pull_requests (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        author_id INTEGER NOT NULL REFERENCES users(id),
        source_branch VARCHAR(255) NOT NULL,
        target_branch VARCHAR(255) NOT NULL,
        state VARCHAR(50) DEFAULT 'open',
        merged_by INTEGER REFERENCES users(id),
        merged_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Comments Table (for Issues & PRs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
        pull_id INTEGER REFERENCES pull_requests(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Collaborators Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS collaborators (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(repo_id, user_id)
      )
    `);

    // Stars Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stars (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(repo_id, user_id)
      )
    `);

    // Forks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS forks (
        id SERIAL PRIMARY KEY,
        original_repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        fork_repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(original_repo_id, fork_repo_id)
      )
    `);

    // Followers Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS followers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, follower_id)
      )
    `);

    // Gists Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        description TEXT,
        content TEXT NOT NULL,
        language VARCHAR(100),
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Releases Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS releases (
        id SERIAL PRIMARY KEY,
        repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
        tag_name VARCHAR(255) NOT NULL,
        release_name VARCHAR(255),
        description TEXT,
        author_id INTEGER NOT NULL REFERENCES users(id),
        is_draft BOOLEAN DEFAULT false,
        is_prerelease BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(repo_id, tag_name)
      )
    `);

    // Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        actor_id INTEGER REFERENCES users(id),
        subject_type VARCHAR(100),
        subject_id INTEGER,
        reason VARCHAR(100),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database schema initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = initializeDatabase;

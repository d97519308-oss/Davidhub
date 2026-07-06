/**
 * Real Database Models for Davidhub
 * CEO and Creator: David Adriano Ferrari dos Santos
 * Davidhub - Real GitHub Clone
 */

const pool = require('../config/database');

class User {
  static async create(username, email, passwordHash, fullName) {
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, username, email, full_name, created_at
    `;
    const result = await pool.query(query, [username, email, passwordHash, fullName]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, username, email, full_name, bio, avatar, location, website,
             followers_count, following_count, is_verified, created_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async updateProfile(id, fullName, bio, avatar, location, website) {
    const query = `
      UPDATE users 
      SET full_name = $1, bio = $2, avatar = $3, location = $4, website = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, username, email, full_name, bio, avatar, location, website
    `;
    const result = await pool.query(query, [fullName, bio, avatar, location, website, id]);
    return result.rows[0];
  }

  static async getAllUsers(limit = 20, offset = 0) {
    const query = `
      SELECT id, username, email, full_name, bio, avatar, followers_count, created_at 
      FROM users 
      ORDER BY followers_count DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

class Repository {
  static async create(name, description, ownerId, isPrivate = false, language = null) {
    const query = `
      INSERT INTO repositories (name, description, owner_id, is_private, language, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, name, description, owner_id, is_private, language, stars, forks, created_at
    `;
    const result = await pool.query(query, [name, description, ownerId, isPrivate, language]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT r.*, u.username as owner_username, u.full_name as owner_name, u.avatar
      FROM repositories r
      JOIN users u ON r.owner_id = u.id
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = `
      SELECT r.*, u.username as owner_username
      FROM repositories r
      JOIN users u ON r.owner_id = u.id
      WHERE r.name = $1
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async getByOwnerId(ownerId, limit = 20, offset = 0) {
    const query = `
      SELECT id, name, description, owner_id, is_private, language, stars, forks, created_at
      FROM repositories
      WHERE owner_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [ownerId, limit, offset]);
    return result.rows;
  }

  static async getAllPublic(limit = 20, offset = 0) {
    const query = `
      SELECT r.*, u.username as owner_username, u.avatar
      FROM repositories r
      JOIN users u ON r.owner_id = u.id
      WHERE r.is_private = false
      ORDER BY r.stars DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id, name, description, isPrivate, language, topics) {
    const query = `
      UPDATE repositories
      SET name = $1, description = $2, is_private = $3, language = $4, topics = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, isPrivate, language, topics, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM repositories WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async incrementStars(id) {
    const query = `
      UPDATE repositories
      SET stars = stars + 1
      WHERE id = $1
      RETURNING stars
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

class Issue {
  static async create(repoId, title, description, authorId, state = 'open') {
    const query = `
      INSERT INTO issues (repo_id, title, description, author_id, state, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [repoId, title, description, authorId, state]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT i.*, u.username as author_username, u.avatar
      FROM issues i
      JOIN users u ON i.author_id = u.id
      WHERE i.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByRepoId(repoId, state = null, limit = 20, offset = 0) {
    let query = `
      SELECT i.*, u.username as author_username, u.avatar
      FROM issues i
      JOIN users u ON i.author_id = u.id
      WHERE i.repo_id = $1
    `;
    const params = [repoId];

    if (state) {
      query += ` AND i.state = $2`;
      params.push(state);
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, title, description, state, assigneeId = null) {
    const query = `
      UPDATE issues
      SET title = $1, description = $2, state = $3, assignee_id = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, state, assigneeId, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM issues WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

class PullRequest {
  static async create(repoId, title, description, authorId, sourceBranch, targetBranch, state = 'open') {
    const query = `
      INSERT INTO pull_requests (repo_id, title, description, author_id, source_branch, target_branch, state, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [repoId, title, description, authorId, sourceBranch, targetBranch, state]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT pr.*, u.username as author_username, u.avatar
      FROM pull_requests pr
      JOIN users u ON pr.author_id = u.id
      WHERE pr.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByRepoId(repoId, state = null, limit = 20, offset = 0) {
    let query = `
      SELECT pr.*, u.username as author_username, u.avatar
      FROM pull_requests pr
      JOIN users u ON pr.author_id = u.id
      WHERE pr.repo_id = $1
    `;
    const params = [repoId];

    if (state) {
      query += ` AND pr.state = $2`;
      params.push(state);
    }

    query += ` ORDER BY pr.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, title, description, state) {
    const query = `
      UPDATE pull_requests
      SET title = $1, description = $2, state = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, state, id]);
    return result.rows[0];
  }

  static async merge(id, mergedBy) {
    const query = `
      UPDATE pull_requests
      SET state = 'merged', merged_by = $1, merged_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [mergedBy, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM pull_requests WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

class Collaborator {
  static async add(repoId, userId, role = 'contributor') {
    const query = `
      INSERT INTO collaborators (repo_id, user_id, role, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (repo_id, user_id) DO UPDATE SET role = $3
      RETURNING *
    `;
    const result = await pool.query(query, [repoId, userId, role]);
    return result.rows[0];
  }

  static async getByRepoId(repoId) {
    const query = `
      SELECT c.*, u.username, u.full_name, u.avatar
      FROM collaborators c
      JOIN users u ON c.user_id = u.id
      WHERE c.repo_id = $1
    `;
    const result = await pool.query(query, [repoId]);
    return result.rows;
  }

  static async remove(repoId, userId) {
    const query = 'DELETE FROM collaborators WHERE repo_id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [repoId, userId]);
    return result.rows[0];
  }
}

class Release {
  static async create(repoId, tagName, releaseName, description, authorId, isDraft = false, isPrerelease = false) {
    const query = `
      INSERT INTO releases (repo_id, tag_name, release_name, description, author_id, is_draft, is_prerelease, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [repoId, tagName, releaseName, description, authorId, isDraft, isPrerelease]);
    return result.rows[0];
  }

  static async getByRepoId(repoId, limit = 20, offset = 0) {
    const query = `
      SELECT r.*, u.username as author_username
      FROM releases r
      JOIN users u ON r.author_id = u.id
      WHERE r.repo_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [repoId, limit, offset]);
    return result.rows;
  }
}

module.exports = {
  User,
  Repository,
  Issue,
  PullRequest,
  Collaborator,
  Release
};

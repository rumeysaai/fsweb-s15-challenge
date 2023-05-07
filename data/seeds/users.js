/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const def1234Password = "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq";
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: "rum", password:def1234Password},
  ]);
};

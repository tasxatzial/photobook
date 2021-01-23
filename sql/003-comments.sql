create table comments
(
	comment_id serial not null
		constraint comments_pkey
			primary key,
	user_name varchar(50)
		constraint comments_user_name_fkey
			references users,
	post_id serial not null
		constraint comments_post_id_fkey
			references posts,
	comment varchar(5000) not null,
	created_at timestamp not null,
	modified_at timestamp not null,
	created_by varchar(100) not null
);

alter table comments owner to postgres;


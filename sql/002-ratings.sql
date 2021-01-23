create table ratings
(
	rating_id serial not null
		constraint ratings_pkey
			primary key,
	user_name varchar(50)
		constraint ratings_user_name_fkey
			references users,
	post_id serial not null
		constraint ratings_post_id_fkey
			references posts,
	rating integer,
	created_by varchar(100) not null
);

alter table ratings owner to postgres;


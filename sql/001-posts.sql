create table posts
(
	post_id serial not null
		constraint posts_pkey
			primary key,
	user_name varchar(50)
		constraint posts_user_name_fkey
			references users,
	description varchar(5000) not null,
	resource_url varchar(500),
	image_url varchar(500),
	image_base64 varchar(10000000),
	latitude varchar(50),
	longitude varchar(50),
	created_at timestamp not null,
	created_by varchar(100) not null
);

alter table posts owner to postgres;


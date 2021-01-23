create table users
(
	user_name varchar(50) not null
		constraint users_pkey
			primary key,
	user_id serial not null,
	password varchar(50) not null,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	birth_date timestamp not null,
	email varchar(50) not null
		constraint users_email_key
			unique,
	gender varchar(50),
	town varchar(50) not null,
	address varchar(50) not null,
	country varchar(50) not null,
	occupation varchar(50) not null,
	interests varchar(100),
	info varchar(500),
	registered_since timestamp not null,
	created_by varchar(100) not null
);

alter table users owner to postgres;


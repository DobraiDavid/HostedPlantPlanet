CREATE TABLE allocate (
    id              int             not null       primary key      auto_increment,
    user_id         int             not null,
    permission_id   varchar(30)     not null,

    foreign key (user_id) references users (id),
    foreign key (permission_id) references permission (id)
);
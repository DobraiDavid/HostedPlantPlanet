create table user (
    id          int             not null    primary key     auto_increment,
    pet_id      int             not null,
    food_id     int             not null,
    date        timestamp       not null,
    quantity    decimal(7,1)    not null,

    foreign key (pet_id) references pet (id),
    foreign key (food_id) references food (id)

);
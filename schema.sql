CREATE TABLE Posts (
    id varchar(5) PRIMARY KEY,
    Title varchar(20),
    PostDate varchar(10),
    PostType varchar(30),
    ContentText text
    );
CREATE TABLE PostTag (
    id varchar(5),
    Tag varchar(20),
    PRIMARY KEY(id,Tag)
    );
CREATE TABLE Tags (
    Tag varchar(20) PRIMARY KEY,
    TagName varchar(20)
    );
CREATE TABLE PostSum (
    id varchar(5),
    Summary varchar(150)
);

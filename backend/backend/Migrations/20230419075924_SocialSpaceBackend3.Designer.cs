﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using web_app.EfCore;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(EF_DataContext))]
    [Migration("20230419075924_SocialSpaceBackend3")]
    partial class SocialSpaceBackend3
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0-preview.1.23111.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("web_app.EfCore.MessageInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string[]>("Answers")
                        .HasColumnType("text[]");

                    b.Property<string>("BotId")
                        .HasColumnType("text");

                    b.Property<string>("ChatId")
                        .HasColumnType("text");

                    b.Property<string[]>("Comments")
                        .HasColumnType("text[]");

                    b.Property<string>("Date")
                        .HasColumnType("text");

                    b.Property<string>("MessageId")
                        .HasColumnType("text");

                    b.Property<int?>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("Text")
                        .HasColumnType("text");

                    b.Property<byte[]>("TextPhoto")
                        .HasColumnType("bytea");

                    b.Property<string>("Type")
                        .HasColumnType("text");

                    b.Property<byte[]>("UserAvatar")
                        .HasColumnType("bytea");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .HasColumnType("text");

                    b.Property<bool?>("isCheck")
                        .HasColumnType("boolean");

                    b.Property<string>("nameFrom")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("MessageInfo");
                });

            modelBuilder.Entity("web_app.EfCore.UsersInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string[]>("Settings")
                        .HasColumnType("text[]");

                    b.Property<string[]>("UsingBots")
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.ToTable("UsersInfo");
                });
#pragma warning restore 612, 618
        }
    }
}

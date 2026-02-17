import random

from sqlmodel import Session, select

from app.database import create_db_and_tables, engine
from app.models.ai_models import AiModel
from app.models.prompts import Prompt, PromptTag
from app.models.users import User, UserRole
from app.security import hash_password

# Lorem Ipsum Generator
LOREM_WORDS = (
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua "
    "ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat "
    "duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur "
    "excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum"
).split()


def get_lorem_words(min_w, max_w):
    count = random.randint(min_w, max_w)
    return " ".join(random.choices(LOREM_WORDS, k=count))


def get_lorem_sentence(min_w=5, max_w=15):
    text = get_lorem_words(min_w, max_w)
    return text.capitalize() + "."


def get_lorem_paragraph(min_s=3, max_s=6):
    count = random.randint(min_s, max_s)
    return " ".join(get_lorem_sentence() for _ in range(count))


def get_lorem_text(min_p=3, max_p=6):
    count = random.randint(min_p, max_p)
    return "\n\n".join(get_lorem_paragraph() for _ in range(count))


def populate():
    # 1. Reset Database
    create_db_and_tables()

    with Session(engine) as session:
        # Check if data already exists to avoid duplicates
        if session.exec(select(User)).first():
            print("Database already populated. Skipping.")
            return

        # 2. Create Users
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("adminadmin"),
            role=UserRole.ADMIN,
        )
        normal_user = User(
            username="user",
            email="user@example.com",
            hashed_password=hash_password("useruser"),
            role=UserRole.USER,
        )
        session.add(admin_user)
        session.add(normal_user)
        session.commit()
        session.refresh(admin_user)
        session.refresh(normal_user)

        # 3. Create AI Models
        gpt4 = AiModel(name="GPT-4", provider="OpenAI")
        claude3 = AiModel(name="Claude 3 Opus", provider="Anthropic")
        llama3 = AiModel(name="Llama 3 70B", provider="Meta")

        session.add(gpt4)
        session.add(claude3)
        session.add(llama3)
        session.commit()
        session.refresh(gpt4)
        session.refresh(claude3)
        session.refresh(llama3)

        # 4. Create Prompts
        prompts = []
        models = [gpt4, claude3, llama3]
        users = [admin_user, normal_user]
        tags = list(PromptTag)

        for i in range(50):
            # Generate varied length text
            name = get_lorem_words(2, 5).title()
            short_desc = get_lorem_sentence(5, 15)
            # Ensure short_desc fits just in case (though it should)
            if len(short_desc) > 250:
                short_desc = short_desc[:250] + "..."

            desc = get_lorem_paragraph(2, 5)  # Longer description (2-5 sentences)
            content = get_lorem_text(5, 10)  # Very long content (5-10 paragraphs)

            tag = random.choice(tags)

            p = Prompt(
                name=name,
                short_description=short_desc,
                description=desc,
                content=content,
                user_id=random.choice(users).id,
                ai_model_id=random.choice(models).id,
                tags=[tag],
            )
            prompts.append(p)

        for p in prompts:
            session.add(p)

        session.commit()
        print("Database populated successfully!")


if __name__ == "__main__":
    populate()

from __future__ import annotations

from typing import List
from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from .database import Base

# relación N:M items–categories
item_categories = Table(
    "item_categories",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)

class ItemImage(Base):
    __tablename__ = "item_images"

    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)

    item = relationship("Item", back_populates="images")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True, nullable=False)

    items = relationship("Item", secondary=item_categories, back_populates="categories")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price_per_h = Column(Float, nullable=False)

    compare_at_price = Column(Float)                            # 🆕
    sku = Column(String, unique=True)                           # 🆕
    stock = Column(Integer, default=1)                          # 🆕
    weight_kg = Column(Float)                                   # 🆕
    shipping_type = Column(String(20), default="free")          # 🆕 "free" | "local_pickup" | "paid"
    condition = Column(String(10), default="new")               # 🆕 "new"  | "used"
    hashtags = Column(ARRAY(String))                            # 🆕  TEXT[]

    image_url = Column(String)           # destacado (legacy)
    owner_username = Column(String, index=True, nullable=False)
    available = Column(Boolean, default=True)

    # relaciones
    categories = relationship("Category", secondary=item_categories, back_populates="items")
    images = relationship(
        "ItemImage",
        back_populates="item",
        cascade="all, delete-orphan",
        order_by="ItemImage.id",
    )

    # helper
    @property
    def image_urls(self) -> List[str]:
        return [img.url for img in self.images]
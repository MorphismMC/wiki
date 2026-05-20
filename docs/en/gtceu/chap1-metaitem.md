# Meta Items

A Meta Item is an item system based on Minecraft's vanilla item system that allows identifying sub-items through metadata. Simply put, it fully utilizes each item's `damage` value to register sub-items, thereby fulfilling the need to register multiple sub-items under a single item ID. This need arises because GregTech needs to generate a large number of material component items and other accessory items.

## Using Meta Items

As the base class for registering meta items, `StandardMetaItem` provides a simple implementation. You only need to extend this class to create a simple meta item class:

::: code-group

```java
import gregtech.api.items.metaitem.StandardMetaItem;

public class GAMetaItem1 extends StandardMetaItem {

    public GAMetaItem1() {
        super();
    }

    @Override
    public void registerSubItems() {
        // ...
    }

}
```

```kotlin
import gregtech.api.items.metaitem.StandardMetaItem

object GAMetaItem() {

    private lateinit var META_ITEMS: MetaItem<*>

    fun init() {
        META_ITEMS = StandardMetaItem()
    }

    fun register() {
        // ...
    }

}

```

```scala
import gregtech.api.items.metaitem.StandardMetaItem

object GAMetaItem {

    private var metaItems: MetaItem[_] = _

    def init(): Unit = {
        metaItems = new StandardMetaItem()
    }

    def register(): Unit = {
        // ...
    }

}

```

:::

In short, a meta item class includes an initialized `StandardMetaItem` object that carries all sub-items, as well as a `registerSubItems` method for registering content. Since `StandardMetaItem` extends `MetaItem`, it possesses all the functionality of `MetaItem`, and can also use some methods based on the vanilla `Item` class, such as using `setCreativeTabs` to set its `CreativeTabs`.

A simple example: if we want to register a meta item named `example_item`, we can do it like this:

::: code-group

```java
import gregtech.api.items.metaitem.StandardMetaItem;

public final class GAMetaItems {

    public static MetaItem<?>.MetaValueItem EXAMPLE_ITEM;

}

public class GAMetaItem1 extends StandardMetaItem {

    public GAMetaItem1() {
        super();
    }

    @Override
    public void registerSubItems() {
        GAMetaItems.EXAMPLE_ITEM = addItem(1, "example_item");
    }

}
```

```kotlin
import gregtech.api.items.metaitem.StandardMetaItem

object GAMetaItem() {

    private lateinit var META_ITEMS: MetaItem<*>

    lateinit var EXAMPLE_ITEM: MetaItem<*>.MetaValueItem

    fun init() {
        META_ITEMS = StandardMetaItem()
    }

    fun register() {
        EXAMPLE_ITEM = META_ITEMS.addItem(1, "example_item")
    }

}

```

```scala
import gregtech.api.items.metaitem.StandardMetaItem

object GAMetaItem {

    private var metaItems: MetaItem[_] = _

    var EXAMPLE_ITEM: MetaItem[_]#MetaValueItem = _

    def init(): Unit = {
        metaItems = new StandardMetaItem()
    }

    def register(): Unit = {
        EXAMPLE_ITEM = metaItems.addItem(1, "example_item")
    }

}

```

:::

Note that when using Kotlin or Scala, you need to call the `init` and `register` methods at the appropriate stages to complete initialization, otherwise registration will fail.

The default model path for a meta item is `assets/gregtech/models/item/metaitems/example_item.json`. You can change it by overriding the corresponding method in the `StandardMetaItem` class. See the relevant methods `formatModelPath` and `createItemModelPath` in the `MetaItem` class for details.

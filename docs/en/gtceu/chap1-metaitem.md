# Meta Items

::: details Why MetaItems are Needed

We need to register a large number of items, including but not limited to various materials and their component variants, circuit components, and derived items. The vanilla item registration system is very unfriendly to us due to ID limitations. Therefore, by utilizing the item's built-in `damage` parameter (you should find a method called `getMetadata(int damage)` in the vanilla `Item` class), we can free up more item registration IDs. This technique of using `damage` / `metadata` to bypass ID limitations is called the "Meta Hack."

:::

A **Meta Item** is an item system based on the vanilla item system that allows identifying sub-items through **metadata**. Simply put, it fully utilizes each item's additional parameters to register sub-items, thereby fulfilling the need to register multiple sub-items under a single item ID, which to some extent bypasses the problem of limited registration IDs.

In GTCEu's terminology, the item described above is called a `MetaItem`, and all sub-items are `MetaValueItem`s. In this chapter, our discussion always focuses on basic items; for content such as `MetaPrefixItem`, please refer to other chapters.

## About Sub-item Construction

In `MetaItem`, according to the generic constraint, `<T>` restricts the generic type to `MetaValueItem`. We cache all sub-items and the required models (or special models) within it.

The method for constructing sub-items, `constructMetaValueItem`, is an abstract method. There are two default options available:
- General items (`StandardMetaItem`): equivalent to directly using `MetaValueItem` for creation.
- Armor items (`ArmorMetaItem`): calls `ArmorMetaValueItem` within `ArmorMetaItem` for creation, which comes with `IArmorLogic`-related handling.

When we use the `addItem` method to add an item, we are essentially constructing a sub-item, then storing it in the corresponding cache and returning the sub-item. All sub-item models are processed through the client-side `registerModels` method. You can modify the default path of sub-item models by overriding the `createItemModelPath` or `formatModelPath` methods within it.

## Registering Meta Items

For general items, we can directly extend the existing `StandardMetaItem` and override its methods:

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

class GAMetaItem1 : StandardMetaItem() {
    override fun registerSubItems() {
        // ...
    }
}
```
:::

For convenience, we generally categorize items by their general type, and the suffix in the class name `GAMetaItem1` here follows this convention. For registration, you can use a unified class `GAMetaItems` to hold the registration objects (which is also more caller-friendly). In the specific registration process, simply use static imports.

::: code-group
```java
// GAMetaItems.java
import gregtech.api.items.metaitem.MetaItem;

public final class GAMetaItems {
    public static MetaItem<?>.MetaValueItem EXAMPLE_ITEM;
}

// GAMetaItem1.java
import gregtech.api.items.metaitem.StandardMetaItem;

import static com.morphismmc.gregica.common.item.GAMetaItems.*;

public class GAMetaItem1 extends StandardMetaItem {
    public GAMetaItem1() {
        super();
    }

    @Override
    public void registerSubItems() {
        EXAMPLE_ITEM = addItem(1, "example_item");
    }
}
```
```kotlin
// GAMetaItems.kt
import gregtech.api.items.metaitem.MetaItem

object GAMetaItems {
    lateinit var EXAMPLE_ITEM: MetaItem<*>.MetaValueItem
}

// GAMetaItem1.kt
import gregtech.api.items.metaitem.StandardMetaItem
import com.morphismmc.gregica.common.item.GAMetaItems.Companion.EXAMPLE_ITEM

class GAMetaItem1 : StandardMetaItem() {
    override fun registerSubItems() {
        EXAMPLE_ITEM = addItem(1, "example_item")
    }
}
```
:::

You also need to choose a registry name for the meta item. All sub-items will exist as IDs under this registry name.
::: code-group
```java
import com.morphismmc.gregica.common.item.GAMetaItem1;
import gregtech.api.items.metaitem.MetaItem;

public final class GAMetaItems {
    public static MetaItem<?>.MetaValueItem EXAMPLE_ITEM;

    public static void init() { // [!code focus]
        GAMetaItem1 first = new GAMetaItem1(); // [!code focus]
        first.setRegistryName("ga_meta_item_1"); // [!code focus]
    } // [!code focus]
}
```
```kotlin
import com.morphismmc.gregica.common.item.GAMetaItem1
import gregtech.api.items.metaitem.MetaItem

object GAMetaItems {
    lateinit var EXAMPLE_ITEM: MetaItem<*>.MetaValueItem

    internal fun init() { // [!code focus]
        GAMetaItem1().let { it.registryName = "ga_meta_item_1" } // [!code focus]
    } // [!code focus]
}
```
:::

The `init` method here should be invoked during the `FMLPreInitializationEvent` phase.

## Sub-item Models and Localization

The default model path for a meta item is `assets/gregtech/models/item/metaitems/example_item.json`.

## Sub-item Behavior

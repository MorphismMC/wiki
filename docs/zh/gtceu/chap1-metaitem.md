# 元物品

::: details 为什么需要元物品

我们需要注册大量的物品，包括但不限于各种材料与其的部件变种，电路元件与派生物品等。原版提供的物品注册由于ID限制对我们十分不友好，
因此，通过利用物品自带的 `damage` 参数（你应该能在原版的 `Item` 类里发现一个叫 `getMetadata(int damage)` 的方法），
我们可以获得更多的物品注册ID空余。这套利用 `damage` / `metadata` 绕过ID限制的方法被称为“Meta Hack”。

:::

**元物品**是基于原版的物品系统的一套允许通过**元数据**来识别子物品的物品系统。
简单来说，它相当于充分利用了物品的每个附加参数来注册子物品，从而实现使用同一个物品注册多个子物品的需求，
这样可以一定程度绕过注册ID有限问题的限制。

按照GTCEu的名词，上述的物品被称为 `MetaItem`，而所有子物品都是 `MetaValueItem`。在本章节中，
我们的讨论始终面对基本的物品，而关于 `MetaPrefixItem` 等内容敬请参考其他章节。

## 关于子物品的构造

在 `MetaItem` 中，根据泛型约束，`<T>` 限定了泛型类型为 `MetaValueItem`，
我们在其中缓存所有子物品以及所必须的模型（或特殊模型）。

构造子物品的行为 `constructMetaValueItem` 是一个抽象方法，具体有两种可选项默认有：
- 一般物品（`StandardMetaItem`）：相当于直接使用 `MetaValueItem` 进行创建。
- 盔甲物品（`ArmorMetaItem`）：会调用 `ArmorMetaItem` 中的 `ArmorMetaValueItem` 进行创建，其附带了 `IArmorLogic` 相关的处理。

当我们使用 `addItem` 方法添加物品时，实际上就是构造了一个子物品，然后将其存储进相应的缓存后返回子物品。
所有子物品的模型通过客户端的`registerModels`方法进行处理。可以通过覆写其中的 `createItemModelPath` 或 `formatModelPath`
方法对子物品模型的默认路径进行修改。

## 注册元物品

对于一般的物品而言，我们可以直接继承已有的 `StandardMetaItem` 并进行覆写：

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

方便起见，我们一般根据物品的大体类型对其进行归类，这里的类名 `GAMetaItems1` 中的后缀也是如此。对于注册方面，
可以使用一个整体的类 `GAMetaItems` 来放置注册对象（这样对调用也比较友好）。在具体的注册过程中，使用静态导入即可。

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

你还需要为元物品选一个注册名，所有子物品将会在这个注册名下作为ID存在。
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

这里的 `init` 方法应当在 `FMLPreInitializationEvent` 阶段进行注册。

## 子物品的模型与本地化

一个元物品的默认模型路径是 `assets/gregtech/models/item/metaitems/example_item.json`。

## 子物品的行为

